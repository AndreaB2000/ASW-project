% simple test case
% likes(mary, pizza).
% likes(john, sushi).

% cell(X,Y,Owner,Count)
%   X,Y       coordinates
%   Owner     `me` or `opponent`
%   Count     number of grains (0-3 normally, 4+ means “unstable”)
%
% A board is just a list of such `cell/4` terms.
% example
% [ cell(1,1,me,2),    cell(1,2,opponent,3), cell(2,1,me,1),    cell(2,2,opponent,0) ]

% legal_move(+Board, +Player, +cell(X,Y))
% Generate all legal_moves for player Player
% use prolog builtin backtracking to enumerate all (X,Y) pairs
legal_move(Board, Player, cell(X,Y)) :-
    member(cell(X,Y,Player,_), Board).

% update_cell(+Board0, +X, +Y, +Owner, +Count, -Board1)
%
% Replace the cell at position X-Y in Board0 with a new cell(X,Y,Owner,Count).
% If a cell at X-Y already exists, it is removed first.  Otherwise, the new
% cell is simply inserted.  The order of cells in Board1 is not significant.
%
% @param Board0  Original board (list of cell/4)
% @param X       X-coordinate of target cell
% @param Y       Y-coordinate of target cell
% @param Owner   Owner for the new cell (`me` or `opponent`)
% @param Count   Grain count for the new cell
% @param Board1  Resulting board after update
%
% Example:
%   ?- update_cell([cell(1,1,me,2)], 1,1, opponent, 3, B).
%   B = [cell(1,1,opponent,3)].
% update_cell(Board0, X, Y, Owner, Count, Board1) :-
%     % Remove any existing cell at X-Y
%     (   select(cell(X, Y, _, _), Board0, Rest)
%     ->  true
%     ;   Rest = Board0
%     ),
%     % Insert the new cell
%     Board1 = [cell(X, Y, Owner, Count) | Rest].


% distribute_grains(+Coords, +Player, +Board0, -BoardF)
%
% For each coordinate X-Y in Coords, add one grain to the cell at X-Y in
% Board0, producing BoardF.  If the target cell belongs to the opponent,
% flip its owner to the Player before incrementing.  If no cell exists at
% X-Y, it is treated as a zero-grain cell of the Player.
%
% This predicate threads the board state through each increment in order.
%
% @param Coords  List of X-Y coordinate pairs
% @param Player  Owner who receives the grains (`me` or `opponent`)
% @param Board0  Initial board before distribution
% @param BoardF  Final board after all grains distributed
%
% Example:
%   ?- distribute_grains([1-1,2-2], me, [cell(1,1,opponent,2)], B).
%   % (1,1) flips to me and becomes 3; (2,2) is inserted with 1
%   B = [cell(2,2,me,1), cell(1,1,me,3)].
% distribute_grains([], _Player, Board, Board).
% distribute_grains([X-Y | Rest], Player, Board0, BoardF) :-
%     % Determine current cell state
%     (   select(cell(X, Y, Owner0, C0), Board0, TempBoard)
%     ->  % If it belonged to opponent, flip ownership
%         (Owner0 \= Player -> Owner1 = Player ; Owner1 = Owner0),
%         C1 is C0 + 1
%     ;   % No existing cell: start fresh
%         Owner1 = Player,
%         C1 = 1,
%         TempBoard = Board0
%     ),
%     update_cell(TempBoard, X, Y, Owner1, C1, Board1),
%     distribute_grains(Rest, Player, Board1, BoardF).

% neighbors(+X, +Y, -Neighbors)
% True when Neighbors is a list of valid coordinate pairs X2-Y2 adjacent
% (up, down, left, right) to the cell at X-Y. Coordinates that would fall
% outside the board grid are omitted.  Assumes grid limits are defined by
% grid_size(MaxX, MaxY) facts.
%
% @param X        X-coordinate of the cell
% @param Y        Y-coordinate of the cell
% @param Neighbors List of X2-Y2 pairs for each valid neighbor
%
% Example:
%   grid_size(3,3).
%   ?- neighbors(1,1, Ns).
%   Ns = [2-1,1-2].
% neighbors(X, Y, Neighbors) :-
%     findall(X2-Y2,
%         (   direction(DX,DY),
%             X2 is X + DX, Y2 is Y + DY,
%             grid_size(MaxX, MaxY),
%             between(1, MaxX, X2),
%             between(1, MaxY, Y2)
%         ),
%         Neighbors).

% directions for adjacency
% direction(1,0).
% direction(-1,0).
% direction(0,1).
% direction(0,-1).

% topple_once(+Board0, +cell(X,Y,Owner,Count), -Board1)
% If Count >= 4, replace that cell by Count-4,
% sprinkle one grain on each neighbor,
% switching ownership if the neighbor was opponent.
% toppel_once(Board0, cell(X,Y,Owner,C0), Board1) :-
%     C0 >= 4,
%     C1 is C0 - 4,
%     update_cell(Board0, X,Y, Owner, C1, B1),
%     neighbors(X,Y, NeighCoords),
%     distribute_grains(NeighCoords, Owner, B1, Board1).

% stabilize(+Board0, -Stable)
% Executes chain-reaction on Board0 until it is stable
% stabilize(Board0, Stable) :-
%   ( select(cell(X,Y,Own,C), Board0, _),
%     C >= 4
%   -> toppel_once(Board0, cell(X,Y,Own,C), Board1),
%      stabilize(Board1, Stable)
%   ;  Stable = Board0
%   ).

% count_my_grains(+Board, -Count)
% Counts all grains in Board belonging to player me
% count_my_grains(Board, Count) :-
%   findall(C, ( member(cell(_,_,me,C), Board) ), List),
%   sum_list(List, Count).

% apply_move(+Player, +cell(X,Y), +Board0, -Board1)
% Increment the cell(X,Y) on Board0
% apply_move(Player, cell(X,Y), Board0, Board1) :-
%   select(cell(X,Y,_,C0), Board0, Rest),
%   C1 is C0 + 1,
%   update_cell(Rest, X,Y, Player, C1, Board1).
%
% best_move(+Board, -BestMove)
% Finds the next BestMove for given Board for player me
% best_move(Board, BestMove) :-
%   findall(
%     Score-Move,
%     ( legal_move(Board, me, Move),
%       apply_move(me, Move, Board, NewBoard),
%       stabilize(NewBoard, Final),
%       count_my_grains(Final, Score)
%     ),
%     Pairs
%   ),
%   keysort(Pairs, Sorted),
%   reverse(Sorted, [ _MaxScore-BestMove | _ ]).

