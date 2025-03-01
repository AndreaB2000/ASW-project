# brainstorming 240225

Consegna proposta 21 Aprile

## DDD

**Domain** : Sandpiles

**Contexts** :

- Account Management
- Game Experience
  - PVP
  - PVE
  - Matchmaking
- Game History

## Glossary

### User: a human interacting with the application through

Player: a User interacting with the sandpiles game.

Login:

Register:

### Game Board: square field divided into square Piles

Pile: a pawn on a Cell.

Grain:

Collapse:

Cell: a tile of the Game Board.

Conquer:

### Clock

Elo Ranking: ranking rappresenting the strenght of a given player.

Matchmaking: the algorithm responsible for selecting players to face each
other among the players available.

## Divisione Lavoro

- Biagini: Game Experience
- Gurioli: Account Management
- Randacio: Matchmaking, PVE, Game History

## Docker deploy

To execute the system via Docker Compose, it is necessary to create the file
`src/server/secrets/mongo_root_password.txt`. Additional instructions are
provided in the `secrets` directory.
