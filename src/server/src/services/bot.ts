import { Move } from '../models/Move';
import * as MoveFactory from '../models/Move';
import { Board } from '../models/Board';
import { queryPrologEngine } from '../prolog/tau-prolog';

export const getMove = async (board: Board): Promise<Move | undefined> => {
  const parsedBoard = parseBoard(board);
  const goal = `best_move(${parsedBoard}, Best).`;

  let result;
  try {
    result = await queryPrologEngine(goal);
  } catch (error) {
    console.error('Error in Prolog engine:', error);
    return undefined;
  }

  if (!result || result.length === 0) {
    console.error('No results from Prolog');
    return undefined;
  }

  const move = result[0];

  try {
    return parseMove(move);
  } catch (error) {
    console.error('Error parsing move result:', error);
    return undefined;
  }
};

const parseMove = (move: string): Move => {
  // The move format is 'Best = cell(2,2)'"
  const regex = /^Best = cell\((\d+),(\d+)\)$/;
  const match = move.match(regex);
  if (!match) {
    throw new Error('Invalid move format');
  }
  const x = parseInt(match[1], 10);
  const y = parseInt(match[2], 10);
  if (isNaN(x) || isNaN(y)) {
    throw new Error('Invalid move coordinates');
  }
  return MoveFactory.create(x, y);
};

const parseBoard = (Board: Board): string => {
  const height = Board.height;
  const width = Board.width;
  const cells = Board.state;

  const cellList = cells
    .flatMap((row, rowIndex) =>
      row.flatMap((cell, colIndex) => {
        if (!cell.pile) return [];
        const owner = cell.pile.owner;
        return [
          `cell(${colIndex}, ${rowIndex}, ${owner === 'bot' ? 'me' : 'opponent'}, ${cell.pile.numberOfGrains})`,
        ];
      }),
    )
    .join(', ');

  return `board(${width}, ${height}, [${cellList}])`;
};
