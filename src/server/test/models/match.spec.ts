import * as matchFactory from '../../src/models/Match';
import { Match } from '../../src/models/Match';
import * as moveFactory from '../../src/models/Move';
import { Move } from '../../src/models/Move';
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('Match', () => {
  let match: Match;
  const PLAYER1 = 'Alice';
  const PLAYER2 = 'Bob';
  const NOW = new Date();
  const MOVE = moveFactory.create(1, 2);
  const MOVE2 = moveFactory.create(2, 3);

  beforeEach(() => {
    match = matchFactory.create(PLAYER1, PLAYER2, NOW);
  });

  it('should have the correct fields inside, given at creation time', () => {
    expect(match.player1).toBe(PLAYER1);
    expect(match.player2).toBe(PLAYER2);
    expect(match.creationDate).toBe(NOW);
  });

  it('should start with an empty moves list', () => {
    expect(match.moves).toStrictEqual([] as Move[]);
  });

  it('addMove should add a move to the moves list', () => {
    const result = match.addMove(MOVE);

    expect(result).toBe(true);
    expect(match.moves.length).toBe(1);
    expect(match.moves[0]).toBe(MOVE);
  });

  it('addMove should add multiple moves to the moves list in order', () => {
    match.addMove(MOVE);
    match.addMove(MOVE2);

    expect(match.moves.length).toBe(2);
    expect(match.moves[0]).toBe(MOVE);
    expect(match.moves[1]).toBe(MOVE2);
  });
});
