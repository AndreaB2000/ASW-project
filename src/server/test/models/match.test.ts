import { describe, it, expect, beforeAll } from '@jest/globals';
import { Match, MatchImpl } from '../../src/models/Match';
import { initialState } from '../../src/models/BoardState';

describe('Match Model', () => {
  const PLAYER1: string = 'Alice';
  const PLAYER2: string = 'Bob';

  let match: Match;
  const currentDate: Date = new Date();

  beforeAll(async () => {
    match = new MatchImpl(PLAYER1, PLAYER2, currentDate);
  });

  it('should create a new match', () => {
    expect(match).not.toBeNull();
  });

  it('should return players after initialization', () => {
    expect(match.player1Name).toEqual(PLAYER1);
    expect(match.player2Name).toEqual(PLAYER2);
  });

  it('should return creation date after initialization', () => {
    expect(match.creationDate).toEqual(currentDate);
  });

  it('should return the default initial state', () => {
    expect(match.initialState).toStrictEqual(initialState());
  });
});
