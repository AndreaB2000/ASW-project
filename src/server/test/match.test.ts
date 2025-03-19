import Match, { MatchDocument, BoardState, Move } from '../src/models/Match';
import { describe, it, expect } from '@jest/globals';

describe('Match Model', () => {
  const PLAYER1: string = 'Alice';
  const PLAYER2: string = 'Bob';
  const PLAYERS: string[] = [PLAYER1, PLAYER2];

  const INITIAL_STATE = [
    [{ pile: { owner: PLAYER1, grains: 1 } }, {}, {}],
    [{}, { pile: { owner: PLAYER2, grains: 1 } }, {}],
    [{}, {}, {}],
  ];

  it('should create and save a new match', async () => {
    const matchData = {
      players: PLAYERS,
      initialState: INITIAL_STATE,
    };

    const match = new Match(matchData);
    const savedMatch = await match.save();

    expect(savedMatch._id).toBeDefined();
    expect(savedMatch.players).toEqual(matchData.players);
    expect(savedMatch.initialState).toEqual(matchData.initialState);
  });

  it('should fail if players are less than two', async () => {
    const matchData = {
      players: [PLAYER1],
      initialState: INITIAL_STATE,
    };

    const match = new Match(matchData);

    await expect(match.save()).rejects.toThrow();
  });

  it('should fail if players are more than two', async () => {
    const matchData = {
      players: [PLAYER1, PLAYER2, 'Charlie'],
      initialState: INITIAL_STATE,
    };

    const match = new Match(matchData);

    await expect(match.save()).rejects.toThrow();
  });

  it('should add a move to the match', async () => {
    const matchData = {
      players: PLAYERS,
      initialState: INITIAL_STATE,
    };

    const match = new Match(matchData);
    const savedMatch = await match.save();

    const move: Move = {
      player: PLAYER1,
      grainPlaced: { x: 1, y: 2 },
      newState: [
        [{ pile: { owner: PLAYER1, grains: 1 } }, {}, {}],
        [{}, { pile: { owner: PLAYER2, grains: 1 } }, {}],
        [{}, { pile: { owner: PLAYER1, grains: 1 } }, {}],
      ],
    };

    savedMatch.moves.push(move);
    const updatedMatch = await savedMatch.save();

    expect(updatedMatch.moves.length).toBe(1);
    expect(updatedMatch.moves[0].player).toBe(PLAYER1);
  });

  it('should fail if initialState is missing', async () => {
    const matchData = {
      players: PLAYERS,
      // initialState is missing
    };

    const match = new Match(matchData);
    await expect(match.save()).rejects.toThrow();
  });
});
