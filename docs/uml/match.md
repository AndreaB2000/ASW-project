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
  - Returns: match ID

- `PUT /match/<id>/move`: Adds a move only if the provided player can make it

  - Body: `{"player1": string, "x": int, "y": int}`
  - Returns: feedback

- `GET /match/<id>`: gets a match with the given ID, if it exists

  - Body: `{}`
  - Returns: match or 404 error

- `GET /match/query/<player>`: returns a list of match IDs

  - Body: `{}`
  - Returns: list of matches (or empty list)

- `DELETE /match/delete?id=<matchId>`: deletes a match

  - Body: `{}`
  - Returns: feedback

## Return format proposal

`{"code": <int>, "details": <string|int|list>}`

Code will be composed by two parts: a 2-digit number identifying the request (e.g. for `/match/new` the code will be "10", for `/match/<id>/move` it will be "11") and a 3-digit number to specify the output of the request, drawing inspiration from HTTP return codes (e.g. "200" for "success", "404" for "not found", ...). The "code" field in the returning JSON will be the concatenation of the two numbers; for example, the code "11200" indicates a success in calling the `/match/<id>/move` API.

Details contain the return content of the API (the match in JSON format in case of a call to `/match/<id>`), or some additional information regarding an error.
