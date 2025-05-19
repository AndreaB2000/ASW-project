import { jest, describe, it, expect, beforeAll } from '@jest/globals';
import * as BoardFactory from '../../src/models/Board';
import * as MoveFactory from '../../src/models/Move';
import { getMove } from '../../src/services/bot';

describe('Bot Service', () => {
  describe('getMove', () => {
    it('should return something', async () => {
      const playerA = 'bot';
      const playerB = 'playerB';
      const result = await getMove(BoardFactory.createDefault(playerA, playerB))
      expect(result).not.toBeUndefined();
    });
  });

  describe('getMove', () => {
    it('should return prolog answer', async () => {
      const playerA = 'bot';
      const playerB = 'playerB';
      const result = await getMove(BoardFactory.createDefault(playerA, playerB))
      expect(result).toStrictEqual(MoveFactory.create(2, 2));
    });
  });
});