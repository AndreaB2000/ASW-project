import MatchRepository from '../src/repositories/MatchRepository';
import MatchService from '../src/services/MatchService';
import { MatchDocument, Move } from '../src/models/Match';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

jest.mock('../src/repositories/MatchRepository');

const PLAYER1 = 'Alice';
const PLAYER2 = 'Bob';
const PLAYERS = [PLAYER1, PLAYER2];
const INITIAL_STATE = [
  [{}, { pile: { owner: PLAYER1, grains: 1 } }, {}],
  [{}, {}, {}],
  [{}, { pile: { owner: PLAYER2, grains: 1 } }, {}],
];
const NEW_STATE = [
  [{}, { pile: { owner: PLAYER1, grains: 2 } }, {}],
  [{}, {}, {}],
  [{}, { pile: { owner: PLAYER2, grains: 1 } }, {}],
];
const MATCH_ID = '1af';

describe('MatchService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a match with default initial state', async () => {
    const mockMatch: MatchDocument = {
      _id: MATCH_ID,
      players: PLAYERS,
      initialState: INITIAL_STATE,
      moves: [] as Move[],
    } as unknown as MatchDocument;

    (MatchRepository.create as jest.Mock).mockReturnValue(mockMatch);

    expect(await MatchService.createMatch(PLAYERS)).toEqual(mockMatch);
    expect(MatchRepository.create).toHaveBeenCalledWith({
      players: PLAYERS,
      initialState: INITIAL_STATE,
    });
  });

  it('should not create a match with != 2 players', async () => {
    /* const mockMatch: MatchDocument = {
      _id: MATCH_ID,
      players: [PLAYER1],
      initialState: INITIAL_STATE,
      moves: [] as Move[],
    } as unknown as MatchDocument; */

    // (MatchRepository.create as jest.Mock).mockReturnValue(mockMatch);

    await expect(MatchService.createMatch([PLAYER1])).rejects.toThrow(
      'Una partita richiede esattamente due giocatori.',
    );
  });

  it('should add a move to a match with a given ID', async () => {
    const move: Move = {
      player: PLAYER1,
      grainPlaced: { x: 1, y: 0 },
      newState: NEW_STATE,
    };
    const updatedMatch: MatchDocument = {
      _id: MATCH_ID,
      players: PLAYERS,
      initialState: INITIAL_STATE,
      moves: [move],
    } as MatchDocument;

    (MatchRepository.addMove as jest.Mock).mockReturnValue(updatedMatch);

    expect(await MatchService.addMove(MATCH_ID, move)).toEqual(updatedMatch);
    expect(MatchRepository.addMove).toHaveBeenCalledWith(MATCH_ID, move);
  });

  it('should get matches where player is involved', async () => {
    const matches: MatchDocument[] = [
      { _id: MATCH_ID, players: PLAYERS, moves: [] } as unknown as MatchDocument,
      { _id: '2', players: [PLAYER1, 'Charlie'], moves: [] } as unknown as MatchDocument,
    ];

    (MatchRepository.findAll as jest.Mock).mockReturnValue(matches);

    expect(await MatchService.getMatchesByPlayer(PLAYER1)).toEqual(matches);
    expect(MatchRepository.findAll).toHaveBeenCalled();
  });
});
