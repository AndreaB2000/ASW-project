% Sandpiles Game Utilities
% ==========================

/** 
 * @file sandpiles_utils.pl
 * @brief Utility predicates for a sandpiles-based board game in Prolog.
 * 
 * This module models a sandpile game where each cell contains grains and belongs to either `me` or `opponent`. 
 * A cell becomes unstable when it has more than 3 grains, and topples by sending grains to its four neighbors.
 */

% ------------------------------------------------------------------------------
% DATA STRUCTURES
% ------------------------------------------------------------------------------

/**
 * @struct cell/4
 * @param X X-coordinate (1-based)
 * @param Y Y-coordinate (1-based)
 * @param Owner Either 'me' or 'opponent'
 * @param Count Number of grains (normally 0–3; 4+ is unstable)
 */

/**
 * @struct board/3
 * @param MaxX Maximum X dimension
 * @param MaxY Maximum Y dimension
 * @param Cells List of cell(X,Y,Owner,Count)
 * 
 * @example
 *   ?- B = board(2,2, [cell(1,1,me,2), cell(1,2,opponent,3),
 *                      cell(2,1,me,1), cell(2,2,opponent,0)]).
 *   B = board(2,2,[cell(1,1,me,2),cell(1,2,opponent,3),cell(2,1,me,1),cell(2,2,opponent,0)])
 */

/**
 * @pred legal_move(+Board, +Player, -cell(X,Y))
 * @brief Checks if a player has a legal move (i.e., owns a cell).
 * @param Board Current game board
t * @param Player The player ('me' or 'opponent')
 * @param cell(X,Y) Output cell where the player can make a move
 * 
 * @example
 *   ?- legal_move(board(2,2,[cell(1,1,me,2)]), me, Move).
 *   Move = cell(1, 1)
 */
legal_move(board(_MaxX,_MaxY,Cells), Player, cell(X,Y)) :-
    member(cell(X,Y,Player,_), Cells).

/**
 * @pred update_cell(+Board0, +X, +Y, +Owner, +Count, -Board1)
 * @brief Replaces or inserts a cell with the given values.
 * @param Board0 Original board
 * @param X X-coordinate of the cell
 * @param Y Y-coordinate of the cell
 * @param Owner Owner of the cell
 * @param Count New grain count
 * @param Board1 Updated board
 * 
 * @example
 *   ?- update_cell(board(2,2,[cell(1,1,me,2)]), 1,1,me,3, B).
 *   B = board(2,2,[cell(1,1,me,3)])
 */
update_cell(board(MaxX,MaxY,Cells0), X, Y, Owner, Count,
            board(MaxX,MaxY,Cells1)) :-
    (   select(cell(X, Y, _, _), Cells0, Rest)
    ->  true
    ;   Rest = Cells0
    ),
    Cells1 = [cell(X, Y, Owner, Count) | Rest].

/**
 * @pred distribute_grains(+Coords, +Player, +Board0, -BoardF)
 * @brief Adds a grain to each coordinate. Flips ownership if needed.
 * @param Coords List of coordinates as X-Y pairs
 * @param Player The player performing the action
 * @param Board0 Initial board
 * @param BoardF Final board after grain distribution
 * 
 * @example
 *   ?- distribute_grains([1-1, 2-2], me, board(2,2,[cell(1,1,me,2),cell(2,2,opponent,3)]), BoardF).
 *   BoardF = board(2,2,[cell(1,1,me,3),cell(2,2,me,4)])
 */
distribute_grains([], _Player, Board, Board).
distribute_grains([X-Y|Rest], Player, Board0, BoardF) :-
    Board0 = board(MaxX,MaxY,Cells0),
    (   select(cell(X, Y, Owner0, C0), Cells0, Temp)
    ->  ( Owner0 \= Player -> Owner1 = Player ; Owner1 = Owner0 ),
        C1 is C0 + 1,
        update_cell(board(MaxX,MaxY,Temp), X, Y, Owner1, C1, TempBoard)
    ;   Owner1 = Player, C1 = 1,
        update_cell(Board0, X, Y, Owner1, C1, TempBoard)
    ),
    distribute_grains(Rest, Player, TempBoard, BoardF).

/**
 * @pred neighbors(+Board, +X, +Y, -Neighbors)
 * @brief Returns toroidal neighbors of a cell.
 * @param Board Current board
 * @param X X-coordinate
 * @param Y Y-coordinate
 * @param Neighbors List of neighboring coordinates as X-Y terms
 * 
 * @example
 *   ?- neighbors(board(3,3,[]), 1,1, Ns).
 *   Ns = [3-1, 2-1, 1-3, 1-2]
 */
neighbors(board(MaxX,MaxY,_), X, Y, [Left,Right,Up,Down]) :-
    Xl is ((X-2) mod MaxX) + 1, Left  = Xl-Y,
    Xr is (X mod MaxX) + 1,   Right = Xr-Y,
    Yu is ((Y-2) mod MaxY) + 1, Up    = X-Yu,
    Yd is (Y mod MaxY) + 1,    Down  = X-Yd.

/**
 * @pred topple_once(+Board0, +cell(X,Y,Owner,Count), -Board1)
 * @brief Performs one toppling step if cell is unstable.
 * @param Board0 Current board
 * @param cell(X,Y,Owner,Count) The cell to be toppled
 * @param Board1 Resulting board after toppling
 * 
 * @example
 *   ?- topple_once(board(2,2,[cell(1,1,me,4),cell(2,1,opponent,1)]), cell(1,1,me,4), Board1).
 *   Board1 = board(2,2,[cell(1,1,me,0),cell(2,1,me,2),cell(1,2,me,1),cell(2,2,me,1)])
 */
topple_once(Board0, cell(X,Y,Owner,C0), Board1) :-
    C0 >= 4,
    C1 is C0 - 4,
    update_cell(Board0, X, Y, Owner, C1, B1),
    neighbors(Board0, X, Y, Neigh),
    distribute_grains(Neigh, Owner, B1, Board1).

/**
 * @pred stabilize(+Board0, -Stable)
 * @brief Repeatedly topples until the board is stable.
 * @param Board0 Initial board
 * @param Stable Final stable board
 * 
 * @example
 *   ?- stabilize(board(2,2,[cell(1,1,me,5)]), Stable).
 *   Stable = board(2,2,[cell(1,1,me,1),cell(2,1,me,1),cell(1,2,me,1),cell(2,2,me,1)])
 */
stabilize(Board0, Stable) :-
  ( Board0 = board(_,_,Cells),
    member(cell(X,Y,Own,C), Cells), C>=4
  -> topple_once(Board0, cell(X,Y,Own,C), B1),
     stabilize(B1, Stable)
  ; Stable = Board0 ).

/**
 * @pred count_my_grains(+Board, -Count)
 * @brief Sums up all grains owned by 'me'.
 * @param Board The current board
 * @param Count Total number of grains owned by 'me'
 * 
 * @example
 *   ?- count_my_grains(board(2,2,[cell(1,1,me,2),cell(1,2,opponent,1)]), Count).
 *   Count = 2
 */
count_my_grains(board(_,_,Cells), Count) :-
  findall(C, member(cell(_,_,me,C), Cells), Cs), sum_list(Cs, Count).

/**
 * @pred apply_move(+Player, +cell(X,Y), +Board0, -Board1)
 * @brief Adds one grain to a specified cell.
 * @param Player The player making the move
 * @param cell(X,Y) The target cell
 * @param Board0 Initial board
 * @param Board1 Board after the move
 * 
 * @example
 *   ?- apply_move(me, cell(2,2), board(2,2,[cell(2,2,me,2)]), Board1).
 *   Board1 = board(2,2,[cell(2,2,me,3)])
 */
apply_move(Player, cell(X,Y), Board0, Board1) :-
  Board0 = board(Mx,My,Cells),
  ( select(cell(X,Y,Own,C0), Cells, Rest)
  -> NewCount is C0+1, NewOwner=Player, update_cell(board(Mx,My,Rest), X,Y,NewOwner,NewCount,Board1)
  ; update_cell(Board0, X,Y,Player,1,Board1) ).

/**
 * @pred best_move(+Board, -BestMove)
 * @brief Computes the move that maximizes grain count for 'me'.
 * @param Board Current board state
 * @param BestMove The optimal move for player 'me'
 * 
 * @example
 *   ?- best_move(board(2,2,[cell(1,1,me,3),cell(2,2,me,2)]), Best).
 *   Best = cell(1, 1)
 */
best_move(Board, BestMove) :-
  findall(Score-Move,
    ( legal_move(Board,me,Move), apply_move(me,Move,Board,B1),
      stabilize(B1,Final), count_my_grains(Final,Score) ), Pairs),
  keysort(Pairs,Sorted), reverse(Sorted,[ _-BestMove | _ ]).
