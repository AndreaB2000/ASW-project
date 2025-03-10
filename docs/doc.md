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

### User: a human interacting with the application through the UI

Player: a User interacting with the sandpiles game.

Login: access the application with a given account.

Register: the creation of a new account.

### Game Board: square field divided into square Cells

Cell: a tile of the Game Board.

Pile: a pawn on a Cell owned by a Player, with a number of Grains.

Grain: fundamental unit of a Pile.

Owner of a Pile: the player who owns the pile.

Game: a sequence of Turns on the Game Board ending when the Win Condition is satisfied for one player.

Win Condition: the Game Board state where all Piles are owned by one player.

Turn: a player move and its eventual collapses.

Move: interaction by which a player increases the number of grains in an owned pile by 1.

Collapse: the event of a pile reaching 4 grains. This event will:

- remove the current pile
- let the adjacent cells be conquered by the owner of the collapsing pile

Conquer: the event of a cell where:

- if empty, a pile with 1 grain is placed
- if not empty, the pile is incremented by 1 and, if the owner is different, the ownership is changed to the conqueror (i.e. the player who made the move)

### Clock

Elo Ranking: ranking rappresenting the strenght of a given player.

Matchmaking: the algorithm responsible for selecting players to face each
other among the players available.

## Work division

- Biagini: Game Experience
- Gurioli: Account Management
- Randacio: Matchmaking, PVE, Game History

## Docker deploy

To execute the system via Docker Compose, it is necessary to create the file
`src/server/secrets/mongo_root_password.txt`. Additional instructions are
provided in the `secrets` directory.
