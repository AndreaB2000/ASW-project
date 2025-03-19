import MatchRepository from '../src/repositories/MatchRepository';
import Match, { Move } from '../src/models/Match';
import { jest, describe, it, expect, afterEach } from '@jest/globals';

jest.mock('../src/models/Match');

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

describe('MatchRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new match', async () => {
    const mockMatchData = {
      players: PLAYERS,
      initialState: INITIAL_STATE,
    };
    const mockSavedMatch = { _id: MATCH_ID, ...mockMatchData, moves: [] as Move[] };

    // Specify that new Match().save() returns mockSavedMatch
    (Match as unknown as jest.Mock).mockImplementation(() => ({
      save: jest.fn<any>().mockResolvedValue(mockSavedMatch),
    }));

    expect(await MatchRepository.create(mockMatchData)).toEqual(mockSavedMatch);
  });

  it('should find all matches', async () => {
    const mockMatches = [{ _id: MATCH_ID, players: PLAYERS, moves: [] as Move[] }];
    (Match.find as jest.Mock).mockReturnValue(mockMatches);

    expect(await MatchRepository.findAll()).toEqual(mockMatches);
    expect(Match.find).toHaveBeenCalledTimes(1);
  });

  it('should find a match by ID', async () => {
    const mockMatch = { _id: MATCH_ID, players: PLAYERS, moves: [] as Move[] };
    (Match.findById as jest.Mock).mockReturnValue(mockMatch);

    expect(await MatchRepository.findById(MATCH_ID)).toEqual(mockMatch);
    expect(Match.findById).toHaveBeenCalledWith(MATCH_ID);
  });

  it('should get the initial board state of a match', async () => {
    const match = { _id: MATCH_ID, initialState: INITIAL_STATE };
    (Match.findById as jest.Mock).mockReturnValue(match);

    expect(await MatchRepository.getInitialBoardState(MATCH_ID)).toEqual(match.initialState);
  });

  it('should get null initial board state if the given ID does not exist', async () => {
    (Match.findById as jest.Mock).mockReturnValue(null);
    expect(await MatchRepository.getInitialBoardState(MATCH_ID)).toEqual(null);
  });

  it('should add a move to a match with a given ID', async () => {
    const move = {
      player: PLAYER1,
      grainPlaced: { x: 1, y: 0 },
      newState: NEW_STATE,
    };
    const mockUpdatedMatch = { _id: MATCH_ID, players: PLAYERS, moves: [move] };

    (Match.findByIdAndUpdate as jest.Mock).mockReturnValue(mockUpdatedMatch);
    (Match.findById as jest.Mock).mockReturnValue(mockUpdatedMatch);

    expect(await MatchRepository.addMove(MATCH_ID, move)).toEqual(mockUpdatedMatch);
    expect(await MatchRepository.findById(MATCH_ID)).toEqual(mockUpdatedMatch);
  });

  it('should get all moves of a match', async () => {
    const mockMatch = {
      _id: MATCH_ID,
      moves: [
        {
          player: PLAYER1,
          grainPlaced: { x: 1, y: 0 },
          newState: NEW_STATE,
        },
      ],
    };
    (Match.findById as jest.Mock).mockReturnValue(mockMatch);

    expect(await MatchRepository.getMoves(MATCH_ID)).toEqual(mockMatch.moves);
  });

  it('should get null moves if the given ID does not exist', async () => {
    (Match.findById as jest.Mock).mockReturnValue(null);
    expect(await MatchRepository.getMoves(MATCH_ID)).toEqual(null);
  });

  it('should get the latest board state', async () => {
    const mockMatch = {
      _id: MATCH_ID,
      initialState: INITIAL_STATE,
      moves: [
        {
          player: PLAYER1,
          grainPlaced: { x: 1, y: 0 },
          newState: NEW_STATE,
        },
      ],
    };
    (Match.findById as jest.Mock).mockReturnValue(mockMatch);

    expect(await MatchRepository.getLatestBoardState(MATCH_ID)).toEqual(
      mockMatch.moves[0].newState,
    );
  });

  it('should get the initial board state if there are no moves', async () => {
    const mockMatch = {
      _id: MATCH_ID,
      initialState: INITIAL_STATE,
      moves: [] as Move[],
    };
    (Match.findById as jest.Mock).mockReturnValue(mockMatch);

    expect(await MatchRepository.getLatestBoardState(MATCH_ID)).toEqual(mockMatch.initialState);
  });

  it('should get null board state if the given ID does not exist', async () => {
    (Match.findById as jest.Mock).mockReturnValue(null);
    expect(await MatchRepository.getLatestBoardState(MATCH_ID)).toEqual(null);
  });

  it('should delete a match by ID', async () => {
    const deletedMatch = { _id: MATCH_ID, players: PLAYERS, moves: [] as Move[] };
    (Match.findByIdAndDelete as jest.Mock).mockReturnValue(deletedMatch);

    expect(await MatchRepository.delete(MATCH_ID)).toEqual(deletedMatch);
    expect(Match.findByIdAndDelete).toHaveBeenCalledWith(MATCH_ID);
  });
});
