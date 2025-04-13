# Match

```mermaid
---
config:
    class:
        hideEmptyMembersBox: true
---

classDiagram
    class Move {
        +x: int
        +y: int
    }

    class Match {
        +player1: string
        +player2: string
        +creationDate: Date
        +initialState: BoardState
        +moves: List~Move~

        +addMove(move: Move)
        +getCurrentState()
    }

    class Database

    %% InProgressMatchRepository contains the list of all matches that started but are not finished (or abandoned). The system keeps these matches "volatile", to avoid massive accesses to the database, and accepting the fact that these matches wuold be lost if the server fails.
    class InProgressMatchRepository {
        %% A list containing all matches in progress
        +matchesInProgress: List~Match~

        %% Creates a new match
        +createMatch(player1: string, player2: string, creationDate: Date) string

        %% Returns a match with the given ID
        +findMatch(matchId: string) Match?

        %% Updates the state of a match
        +updateMatch(matchId: string, newMatchData: Match) void

        %% Deletes a match with the given ID
        +deleteMatch(matchId: string) void
    }


    %% EndedMatchRepository handles ended matches, to be saved on the database.
    class EndedMatchRepository {
        %% Creates a new match
        +createMatch(player1: string, player2: string, creationDate: Date) string

        %% Returns a match with the given ID
        +findMatch(matchId: string) Match?

        %% Updates the state of a match
        +updateMatch(matchId: string, newMatchData: Match) void

        %% Deletes a match with the given ID
        +deleteMatch(matchId: string) void
    }

    %% MatchesService expose higher-level functionalities, and it handles the matches saving logic.
    class MatchService {

        %% Creates a new match, returns its ID
        +newMatch(player1: string, player2: string, creationDate: Date?) string

        %% Gets a match with the given ID, if it exists
        +getMatch(matchId: string) Match?

        %% Returns a list of match IDs
        +getMatchesByPlayer(player: string) List~string~

        %% Adds a move only if the provided player can make it
        +addMove(matchId: string, movingPlayer: string, move: Move) void

        %% Deletes a match
        +deleteMatch(matchId: string) void
    }

    %% A fixed-sized matrix of cells
    class Board {

        %% The default board state
        +defaultBoard() Board$

        +getCell(x: int, y: int) Cell
        +setCell(x: int, y: int, cell: Cell) void
        +applyMove(movingPlayer: string, move: Move) void
    }

    %% Board cell which can contain a pile
    class Cell {
        +pile: Pile?
        +putPile(pile: Pile) void
        +removePile() void
    }

    class Pile {
        +numberOfGrains: int
        +owner: string

        %% Returns true if the grain has been added, false if it cannot be added
        +addGrain() boolean
        +changeOwner(newOwner: string) void
    }

    EndedMatchRepository ..> Database
    MatchService ..> InProgressMatchRepository
    MatchService ..> EndedMatchRepository
    InProgressMatchRepository ..> Match
    EndedMatchRepository ..> Match
    MatchService ..> Match
    Match ..> Move
    Match ..> Board
    Board *-- Cell
    Cell *-- Pile
```

## APIs

- `POST /match/new`: creates a match, returns its ID

  - Body: `{"player1": string, "player2": string}`
  - Returns:
    - 201 Created - `{"matchId": <string>}`
    - 400 Bad request - `{}` when the body is not complete
    - 401 Unauthorized - `{}` when the client is not logged in
    - 500 Internal server error - `{}` when a generic error occurs

- `PUT /match/<id>/move`: Adds a move only if the provided player can make it

  - Body: `{"player1": string, "x": int, "y": int}`
  - Returns:
    - 200 OK - `{}` when the move is successfully added to the match
    - 400 Bad request - `{}` when the body is not complete
    - 401 Unauthorized - `{}` when the client is not logged in
    - 403 Forbidden - `{}` when the player can't make a move
    - 500 Internal server error - `{}` when a generic error occurs

- `GET /match/<id>`: gets a match with the given ID, if it exists

  - Body: `{}`
  - Returns:
    - 200 OK - `{<match>}` when the move is successfully added to the match
    - 401 Unauthorized - `{}` when the client is not logged in
    - 404 Not found - `{}` when there is no match with the given ID
    - 500 Internal server error - `{}` when a generic error occurs

- `GET /match/query/<player>`: returns a list of match IDs

  - Body: `{}`
  - Returns:
    - 200 OK - `{"matches": [<matches>]}` the list can be empty
    - 401 Unauthorized - `{}` when the client is not logged in
    - 404 Not found - `{}` when the provided player does not exist
    - 500 Internal server error - `{}` when a generic error occurs

- `DELETE /match/delete?id=<matchId>`: deletes a match

  - Body: `{}`
  - Returns:
    - 200 OK - `{}` when the match is successfully deleted
    - 400 Bad request - `{}` when query args are not specified
    - 401 Unauthorized - `{}` when the client is not logged in
    - 403 Forbidden - `{}` when the player can't delete that match
    - 404 Not found - `{}` when the provided match ID does not exist
    - 500 Internal server error - `{}` when a generic error occurs
