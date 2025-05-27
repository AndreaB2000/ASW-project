import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import * as BoardFactory from '../../src/models/Board';
import * as MoveFactory from '../../src/models/Move';
import { getMove } from '../../src/services/bot';
import { query } from '../../src/prolog/prolog';

// Mock dependencies
jest.mock('../../src/prolog/tau-prolog');
jest.mock('../../src/models/Move');

describe('Bot Service', () => {
  // Ensure mocks are reset between tests
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getMove', () => {
    it('should return something', async () => {
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockResolvedValue(['Best = cell(2,2)']);
      (MoveFactory.create as jest.Mock).mockImplementation((x, y) => ({ x, y }));

      const playerA = 'bot';
      const playerB = 'playerB';
      const result = await getMove(BoardFactory.createDefault(playerA, playerB));

      expect(result).not.toBeUndefined();
    });

    it('should return prolog answer', async () => {
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockResolvedValue(['Best = cell(2,2)']);
      (MoveFactory.create as jest.Mock).mockImplementation((x, y) => ({ x, y }));

      const playerA = 'bot';
      const playerB = 'playerB';
      const result = await getMove(BoardFactory.createDefault(playerA, playerB));

      expect(MoveFactory.create).toHaveBeenCalledWith(2, 2);
      expect(result).toEqual({ x: 2, y: 2 });
    });

    it('should return undefined when no results from Prolog', async () => {
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockResolvedValue([]);

      const playerA = 'bot';
      const playerB = 'playerB';
      const result = await getMove(BoardFactory.createDefault(playerA, playerB));

      expect(result).toBeUndefined();
    });

    it('should return undefined when Prolog query throws an error', async () => {
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockRejectedValue(new Error('Prolog error'));

      const playerA = 'bot';
      const playerB = 'playerB';
      const result = await getMove(BoardFactory.createDefault(playerA, playerB));

      expect(result).toBeUndefined();
    });

    it('should throw an error when Prolog returns invalid move format', async () => {
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockResolvedValue(['Invalid format']);

      const playerA = 'bot';
      const playerB = 'playerB';

      const result = await getMove(BoardFactory.createDefault(playerA, playerB));
      expect(result).toBeUndefined();
    });

    it('should throw an error when Prolog returns non-numeric coordinates', async () => {
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockResolvedValue(['Best = cell(x,y)']);

      const playerA = 'bot';
      const playerB = 'playerB';

      const result = await getMove(BoardFactory.createDefault(playerA, playerB));
      expect(result).toBeUndefined();
    });
  });

  describe('parseBoard', () => {
    it('should correctly convert a board to Prolog representation', async () => {
      // Mock a simple board
      const mockBoard = {
        width: 3,
        height: 3,
        state: [
          [
            { pile: { owner: 'bot', numberOfGrains: 2 } },
            { pile: null },
            { pile: { owner: 'playerB', numberOfGrains: 1 } },
          ],
          [{ pile: null }, { pile: { owner: 'bot', numberOfGrains: 3 } }, { pile: null }],
          [{ pile: { owner: 'playerB', numberOfGrains: 2 } }, { pile: null }, { pile: null }],
        ],
      };

      // Mock Prolog query to return our expected result
      const mockQueryProlog = query as jest.MockedFunction<typeof query>;
      mockQueryProlog.mockResolvedValue(['Best = cell(1,1)']);
      (MoveFactory.create as jest.Mock).mockImplementation((x, y) => ({ x, y }));

      await getMove(mockBoard as any);

      // Verify that the Prolog query was called with the correct board representation
      expect(mockQueryProlog).toHaveBeenCalledWith(
        expect.stringContaining(
          'board(3, 3, [cell(0, 0, me, 2), cell(2, 0, opponent, 1), cell(1, 1, me, 3), cell(0, 2, opponent, 2)])',
        ),
      );
    });
  });
});
