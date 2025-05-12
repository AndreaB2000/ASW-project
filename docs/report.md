# Sandpiles

Project for the course _Applicazioni e Servizi Web_

Andrea Biagini - 0001145679 <andrea.biagini5@studio.unibo.it>

Filippo Gurioli - 0001146182 <filippo.gurioli@studio.unibo.it>

Leonardo Randacio - 0001125080 <leonardo.randacio@studio.unibo.it>

<!-- TODO PUT DELIVERY DATE HERE -->

- [Sandpiles](#sandpiles)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
    - [Functional Requirements](#functional-requirements)
      - [User Functional Requirements](#user-functional-requirements)
      - [System Functional Requirements](#system-functional-requirements)
    - [Non-Functional Requirements](#non-functional-requirements)
    - [Implementation Requirements](#implementation-requirements)
  - [Design](#design)
    - [Domain Model](#domain-model)
      - [Context map](#context-map)
    - [Mockup](#mockup)
    - [Architecture](#architecture)
      - [Frontend](#frontend)
      - [Backend](#backend)
    - [Detailed Design](#detailed-design)
      - [Game State Data Representation](#game-state-data-representation)
      - [Rating System](#rating-system)
      - [Matchmaking](#matchmaking)
        - [Server side matchmaking class diagram](#server-side-matchmaking-class-diagram)
        - [Matchmaking sequence diagram](#matchmaking-sequence-diagram)
        - [Matchmaking Algorithm](#matchmaking-algorithm)
      - [Match](#match)
        - [API](#api)
  - [Implementation](#implementation)
  - [Technologies](#technologies)
  - [Code](#code)
  - [Tests](#tests)
  - [Deployment](#deployment)
  - [Conclusions](#conclusions)

## Introduction

_Sandpiles_ is a project designed to emulate the functionality of online board game platforms, providing an interactive and competitive environment for players of all skill levels to play _Sandpiles_. The platform offers real-time matchmaking, AI-driven opponent, statistics review and match history review.

The _Sandpiles_ game is based on the [Abelian sandpiles mathematical model](https://en.wikipedia.org/wiki/Abelian_sandpile_model). It sees two players face each other head to head in a strategic game with time constrains.

Developed with a focus on usability, performance, and scalability, _Sandpiles_ aims to demonstrate best practices in web application development while delivering an engaging and accessible game experience.

## Requirements

During project analysis the following requirements have been identified.

### Functional Requirements

#### User Functional Requirements

The user can:

1. User authentication
   1. Register a new account on the website
      1. Choose a unique username
      1. Choose a password
      1. Confirm the password
   1. Login to the website using an existing account
   1. Logout from the website
1. Profile
   1. View profile statistics
   1. View profile game history
      1. Review old games move by move
   1. Customize profile settings
      1. Load a custom profile picture
      1. Set the website theme
      1. Change profile name
      1. Change profile password
      1. Customize the game board style choosing from some given styling options
1. Game
   1. As a logged in user
      1. Play a ranked game against other users of similar rating
      1. Play an unranked game against an AI opponent
   1. As a guest user
      1. Play an unranked game against an AI opponent
   1. Gameplay
      1. Add a grain to a controller pile
      1. View opponents moves
      1. View personal and opponent clock time remaining
      1. Resign the current game
      1. Disconnect from the current game
1. View the website leaderboard
1. View a tutorial on _Sandpiles_ game rules
1. Developers
   1. Use the public API to access data about players and games, in an authenticated manner
   1. Find the public API documentation on the _Sandpiles_ website

#### System Functional Requirements

- usare jwt?
- gestione dati sensibili (hashing locale, salt in db, conferma e-mail)

1. Security
   1. Password hashing client side
   1. Matching double password input at registration time
   1. Matching double password input at password change time
   1. Hashed password storage with salting server side
   1. Profile confirmation with e-mail
1. User session handling
1. Badge system handling to encourage user retention

### Non-Functional Requirements

1. Responsive UI: The website interface adapts to the user's device to allow identical use across devices
1. AI opponent responds to the user's moves in under a second
1. Intuitive UI design allows users to interact with the website intuitively

### Implementation Requirements

1. MEVN
   1. MongoDB database technology
   1. Express.js backend technology
   1. Vue.js frontend technology
   1. Node.js runtime environment
1. Logical programming language for game AI

## Design

The following design has been developed starting from the user stories specified [here](user-stories.md). From the user stories we also have derived the domain model (which established an ubiquitous jargon) and the pages flow diagram as shown below.

```mermaid
flowchart TD
    A@{ shape: circle, label: "Start" } -->|auto login| Play(Play)
    A@{ shape: circle, label: "Start" } --> Landing(Landing)
    Landing <--> Login(Login)
    Landing <--> Register(Register)
    Landing <--> Tutorial(Tutorial)
    Landing -->|play bot| Match
    Register -->|registration completed| Login
    Login --> Play
    Play <--> Tutorial(Tutorial)
    Play <-->|play ranked| MatchMaking(Match Making)
    Play -->|play bot| Match
    Play <--> Profile(Profile)
    Tutorial -->|play ranked| MatchMaking
    Tutorial -->|play bot| Match
    MatchMaking -->|opponent found| Match(Match)
    Match -->|quit| Play
    Match -->|game over| GameEnd("Game End (stats)")
    GameEnd -->|play again| Match
    GameEnd --> Play
    GameEnd --> Leaderboard
    GameEnd --> Profile
    Leaderboard <--> Profile
    Profile <--> MatchHistory(Match History)
    MatchHistory <--> Replay(Replay)
```

Based on the pages flow a project mockup has been developed also taking into account user experience and adopting a user centered approach.

Requirements suggested an hexagonal client server architecture as explained in the dedicated [sub-section](#architecture).

### Domain Model

**Domain**: Sandpiles game

**Contexts**:

- Account Management
- Game Experience
  - PVP
  - PVE
  - Matchmaking
- Game History

**Glossary**:

_User_: a human interacting with the application through the UI

_Player_: a User interacting with the sandpiles game.

_Account_: a User representation with username and password used to access application.

_Login_: access the application with a given account.

_Register_: the creation of a new account.

_Game Board_: square field divided into square Cells

_Cell_: a tile of the Game Board.

_Pile_: a pawn on a Cell owned by a Player, with a number of Grains.

_Grain_: fundamental unit of a Pile.

_Owner of a Pile_: the player who owns the pile.

_Match_: a sequence of Turns on the Game Board ending when the Win Condition is satisfied for one player.

_Win Condition_: the Game Board state where all Piles are owned by one player or the opponent clock's time is finished.

_Turn_: a player move and its eventual collapses.

_Move_: interaction by which a player increases the number of grains in an owned pile by 1.

_Collapse_: the event of a pile reaching 4 grains. This event will:

- remove the current pile
- let the adjacent cells be conquered by the owner of the collapsing pile

_Conquer_: the event of a cell where:

- if empty, a pile with 1 grain is placed
- if not empty, the pile is incremented by 1 and, if the owner is different, the ownership is changed to the conqueror (i.e. the player who made the move)

_Clock_: time counter that tracks how many seconds each player has left to play to game

_Glicko rating system_: method used to calculate and update player ratings in competitive games and sports ([link](https://en.wikipedia.org/wiki/Glicko_rating_system)).

_Glicko Ranking_: ranking rappresenting the strenght of a given player.

_Matchmaking_: the algorithm responsible for selecting players to face each
other among the players available.

#### Context map

The following context map arises from the previous description.

```mermaid
graph LR
   subgraph gameExperience["Game experience"]
      subgraph matchContext["Match context"]
         player1("Player")
         glickoRanking1("Glicko Ranking")
         GameBoard
         Cell
         Pile
         Grain
         PileOwner
         Match
         WinCondition
         Move
         Turn
         Collapse
         Conquer
         Clock
      end

      subgraph matchMaking["Matchmaking"]
         glickoRanking2("Glicko Ranking") <--> glickoRanking1
         player2("Player") <--> player1
      end
   end

   subgraph accountManagement["Account management"]
      User <--> player1
      User <--> player2
      Login
      Register
   end
```

### Mockup

![Dashboard](images/mockup/Dashboard.png)

![Landing](images/mockup/Landing.png)

![Leaderboard](images/mockup/Leaderboard.png)

![Login](images/mockup/Login.png)

![Match end](images/mockup/Match%20end.png)

![Match](images/mockup/Match.png)

![Matchmaking](images/mockup/Matchmaking.png)

![Profile and Match History](images/mockup/Profile%20&%20match%20history.png)

![Register](images/mockup/Register.png)

\newpage

The following are the responsive versions of the mockup pages.

![Dashboard Responsive](images/mockup/Dashboard%20Responsive.png)

![Landing Responsive](images/mockup/Landing%20Responsive.png)

![Leaderboard Responsive](images/mockup/Leaderboard%20Responsive.png)

![Login Responsive](images/mockup/Login%20Responsive.png)

![Match end Responsive](images/mockup/Match%20end%20Responsive.png)

![Match Responsive](images/mockup/Match%20Responsive.png)

![Matchmaking Responsive](images/mockup/Matchmaking%20Responsive.png)

![Profile and Match History Responsive](images/mockup/Profile%20&%20history%20Responsive.png)

![Register Responsive](images/mockup/Register%20Responsive.png)

\newpage

### Architecture

#### Frontend

The frontend uses a component-based architecture.

The main components map one-to-one the pages listed in the [mockup](#mockup).

Also some components are present in all pages, such as the header and the footer.

```mermaid
graph LR
   subgraph App
      Header
      Navbar
      Footer
   end
   Match
   Matchmaking
   Profile
   Leaderboard
   MatchHistory
   Replay
   GameEnd

   Landing
   Login
   Register

   %% Header dependencies
   Match --> Header
   Matchmaking --> Header
   Profile --> Header
   Leaderboard --> Header
   MatchHistory --> Header
   Replay --> Header
   GameEnd --> Header

   %% Navbar dependencies
   Match --> Navbar
   Matchmaking --> Navbar
   Profile --> Navbar
   Leaderboard --> Navbar
   MatchHistory --> Navbar
   Replay --> Navbar
   GameEnd --> Navbar

   %% Footer dependencies
   Landing --> Footer
   Login --> Footer
   Register --> Footer
   Match --> Footer
   Matchmaking --> Footer
   Profile --> Footer
   Leaderboard --> Footer
   MatchHistory --> Footer
   Replay --> Footer
   GameEnd --> Footer
```

Components diagram

The arrows should be read as "depends on" (e.g. A --> B should be read A depends on B).

#### Backend

The backend uses an hexagonal architecture, leveraging Domain Driven Design [DDD](https://it.wikipedia.org/wiki/Domain-driven_design) principles.

```mermaid
graph TD
      subgraph Domain[Domain]
         ValueObject
         Entity
         AggregateRoot
      end
      Factory --> Domain
      DB
      Repository --> DB
      Service --> Repository
      API --> Service
      Service --> Factory
      Repository --> Factory
```

This graph represents the dependencies in the hexagonal architecture.

The arrows should be read as "depends on" (e.g. A --> B should be read A depends on B).

### Detailed Design

Repository classes should only implement CRUD (Create, Read, Update, Delete) operations, while higher-level operations should be implemented in the Service classes.

#### Game State Data Representation

A given match can be represented uniquely by:

- A starting board
- A list of moves

The starting board can be represented as a matrix of dimensions dxd where every given x<sub>i,j</sub> is the number of grains in the cell with coordinates i,j.

The list of moves can be represented as a list of tuples (i,j) where the tuple represents the coordinates of the cell where the player has decided to add a grain.

<!-- RICORDARSI DI INSERIRE COME SONO STATI MAPPATI I VARI CONCETTI DI UBIQUITOUS LANGUAGE (in quale building block) -->

#### Rating System

The rating system is based on the Elo rating system, which is a method for calculating the relative skill levels of players in two-player games.

Every player has a rating, which is a number that represents their skill level. The higher the rating, the better the player.

The rating is updated after each match based on the outcome of the match and the ratings of the players involved.

The rating is updated using the following formula: <!-- NOT IMPLEMENTED YET -->

R<sub>new</sub> = R<sub>old</sub> + K * (S - E)

Where:

- R<sub>new</sub> is the new rating
- R<sub>old</sub> is the old rating
- K is a constant that determines the maximum possible adjustment per game
- S is the actual score (1 for a win, 0.5 for a draw, 0 for a loss)
- E is the expected score, calculated using the following formula:

#### Matchmaking

The matchmaking system is responsible for pairing players with similar Elo ratings.

The server will check if there are other players in the queue with similar Elo ratings. If so, it will create a match and notify both players.

If no players are found, the server will add the player to the queue and wait for other players to join.

Every 3 seconds, the server will check if there are players in the queue with compatible Elo ratings. If so, it will create a match and notify both players.

Every 10 seconds a player spends in the queue, the matchmaking requirements are slackened as by the following formula:

IsValidMatch(baseValue , rating<sub>1</sub> , rating<sub>2</sub> , time<sub>1</sub> , time<sub>2</sub>) =

| rating<sub>1</sub> - rating<sub>2</sub> | <= min( (time<sub>1</sub> / 10), (time<sub>2</sub> / 10) ) * 100 + baseValue

Where:

- IsValidMatch is a function that returns true if the match is valid and false otherwise
- rating<sub>1</sub> and rating<sub>2</sub> are the Elo ratings of the two players
- time<sub>1</sub> and time<sub>2</sub> are the times spent in the queue by the two players in seconds
- baseValue is a constant that represents the minimum difference in ratings that is acceptable for a match

If a player disconnects from the queue, the server will remove them from the queue and notify them. <!-- NOT IMPLEMENTED -->

##### Server side matchmaking class diagram

```mermaid
---
  config:
    class:
      hideEmptyMembersBox: true
---

classDiagram
    class MatchmakingRoute
    class MatchmakingController
    class MatchmakingService
    class Player
    class Rating
    class PlayerRepository
    class MatchmakingQueueRepository
    class MatchmakingQueue
    class MatchmakingCandidate

    MatchmakingRoute --> MatchmakingController
    MatchmakingController --> MatchmakingService
    MatchmakingService --> Player
    MatchmakingService --> PlayerRepository
    PlayerRepository --> Player
    Player --> Rating
    MatchmakingService --> MatchmakingQueueRepository
    MatchmakingQueueRepository --> MatchmakingQueue
    MatchmakingService --> MatchmakingQueue
    MatchmakingQueue --> MatchmakingCandidate
```

##### Matchmaking sequence diagram

```mermaid
sequenceDiagram
   participant Client1
   participant Server
   participant Client2

   Client1->>Server: emit('requestMatch', { playerId: playerId1 })
   Note over Server: playerId1 is added to the queue

   Client2->>Server: emit('requestMatch', { playerId: playerId2 })

   Note over Server: playerId1 is removed from the queue
   Server-->>Client1: emit('matchFound', { matchId })
   Server-->>Client2: emit('matchFound', { matchId })
```

##### Matchmaking Algorithm

The matchmaking algorithm matches players with similar Elo ratings.

#### Match

[Match UML](uml/match.md)

##### API

- `POST /match/new`: creates a match, returns its ID

  - Body: `{"player1": string, "player2": string}`
  - Returns:
    - 201 Created - `{"matchId": <string>}`
    - 400 Bad request - `{}` when the body is not complete
    - 401 Unauthorized - `{}` when the client is not logged in
    - 500 Internal server error - `{}` when a generic error occurs

- `PUT /match/<id>/move`: Adds a move only if the provided player can make it

  - Body: `{movingPlayer: string, x: number, y: number}`
  - Returns:
    - 200 OK - `{}` when the move is successfully added to the match
    - 400 Bad request - `{}` when the body is not complete
    - 401 Unauthorized - `{}` when the client is not logged in
    - 403 Forbidden - `{}` when the player can't make a move
    - 500 Internal server error - `{}` when a generic error occurs

- `GET /match/<id>`: gets a match with the given ID, if it exists

  - Body: `{}`
  - Returns:
    - 200 OK - `{id: number, <match>}` when the move is successfully added to the match
    - 401 Unauthorized - `{}` when the client is not logged in
    - 404 Not found - `{}` when there is no match with the given ID
    - 500 Internal server error - `{}` when a generic error occurs

- `GET /match/byplayer/<player>`: returns a list of match IDs

  - Body: `{}`
  - Returns:
    - 200 OK - `{player: string, matchIDs: string[]}` the list can be empty
    - 401 Unauthorized - `{}` when the client is not logged in
    - 404 Not found - `{}` when the provided player does not exist
    - 500 Internal server error - `{}` when a generic error occurs

- `DELETE /match/<id>/delete`: deletes a match

  - Body: `{}`
  - Returns:
    - 200 OK - `{}` when the match is successfully deleted
    - 401 Unauthorized - `{}` when the client is not logged in
    - 403 Forbidden - `{}` when the player can't delete that match
    - 404 Not found - `{}` when the provided match ID does not exist
    - 500 Internal server error - `{}` when a generic error occurs

## Implementation

## Technologies

MEVN

## Code

Solo aspetti rilevanti.

## Tests

<!-- Test effettuati sul codice e test con utenti. -->

jest and stuff

<!-- TODO specificare come runnare i test, coverage, decisioni ecc-->

## Deployment

<!-- Rilascio, installazione e messa in funzione. -->

To execute the system, it is necessary to create a .env file specifying
parameters for server and database execution. The `.env` file must be in the
root project directory and must contain the following parameters:

## Conclusions

Conclusions
