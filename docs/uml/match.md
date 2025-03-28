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
    }

    class Database

    %% MatchRepository contains the list of all matches that started but are not finished (or abandoned). The system keeps these matches "volatile", to avoid massive accesses to the database, and accepting the fact that these matches wuold be lost if the server fails.
    class MatchRepository {
        %% A list containing all matches that started but are not finished (or abandoned).
        +matchesInProgress: List~Match~

        %% Creates a match inside matchesInProgress.
        +createMatch(player1: string, player2: string, creationDate: Date) string

        %% Returns a match with the given ID, searching in both the DB and the list of matches in progress.
        +findMatch(matchId: string) Match?

        %% Updates the state of a match saved inside the list of matches in progress (an ended match, saved in the DB, can't be updated).
        +updateMatch(newMatchData: Match) void

        %% Deletes a match with the given ID, whether it is in the DB or in the list of matches in progress.
        +deleteMatch(matchId: string) void
    }

    %% MatchesService expose higher-level functionalities, and it is transparent to the matches saving logic.
    class MatchService {

        %% Creates a new match, returns its ID
        +newMatch(player1: string, player2: string, creationDate: Date?) string

        %% Adds a move only if the provided player can make it
        +addMove(matchId: string, movingPlayer: string, move: Move) void

        %% Gets a match with the given ID, if it exists
        +getMatch(matchId: string) Match?

        %% Returns a list of match IDs
        +getMatchesByPlayer(player: string) List~string~

        %% Deletes a match
        +deleteMatch(matchId: string) void
    }

    class BoardState {
    }

    MatchRepository ..> Database
    MatchService ..> MatchRepository
    MatchRepository ..> Match
    MatchService ..> Match
    Match ..> Move
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
