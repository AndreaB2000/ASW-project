import { describe, it, expect, beforeAll } from '@jest/globals';
import { BoardState, Match, MatchImpl, Player } from '../src/models/Match';

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
    expect(match.player1).toEqual(PLAYER1);
    expect(match.player2).toEqual(PLAYER2);
  });

  it('should return creation date after initialization', () => {
    expect(match.creationDate).toEqual(currentDate);
  });

  it('should return the default initial state', () => {
    const expectedInitialState: BoardState = [
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, { pile: { owner: Player.PLAYER1, grains: 1 } }, {}, {}],
      [
        {},
        {},
        {},
        {},
        {},
        { pile: { owner: Player.PLAYER1, grains: 1 } },
        {},
        { pile: { owner: Player.PLAYER1, grains: 1 } },
        {},
      ],
      [{}, {}, {}, {}, {}, {}, { pile: { owner: Player.PLAYER1, grains: 1 } }, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, { pile: { owner: Player.PLAYER2, grains: 1 } }, {}, {}, {}, {}, {}, {}],
      [
        {},
        { pile: { owner: Player.PLAYER2, grains: 1 } },
        {},
        { pile: { owner: Player.PLAYER2, grains: 1 } },
        {},
        {},
        {},
        {},
        {},
      ],
      [{}, {}, { pile: { owner: Player.PLAYER2, grains: 1 } }, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    ];

    expect(match.initialState).toStrictEqual(expectedInitialState);
  });
});
