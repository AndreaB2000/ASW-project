import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { addMove, deleteMatch, getMatch, getMatchesByPlayer } from '../../src/controllers/match';
import * as matchService from '../../src/services/match';
import * as moveFactory from '../../src/models/Move';
import * as matchFactory from '../../src/models/Match';

const app = express();
app.use(express.json());
app.put('/match/:id/move', addMove);
app.get('/match/:id', getMatch);
app.get('/match/byplayer/:player', getMatchesByPlayer);
app.delete('/match/:id/delete', deleteMatch);

jest.mock('../../src/services/match', () => ({
  addMove: jest.fn(),
  getMatch: jest.fn(),
  getMatchesByPlayer: jest.fn(),
  deleteMatch: jest.fn(),
}));

const MATCH_ID = 'testid';
const OTHER_ID = 'testid';
const PLAYER_IN_TURN = 'player1';
const PLAYER_NOT_IN_TURN = 'player2';

describe('PUT /match/:id/move', () => {
  const ROUTE = `/match/${MATCH_ID}/move`;
  const IN_TURN_BODY = { movingPlayer: PLAYER_IN_TURN, x: 1, y: 2 };
  const NOT_IN_TURN_BODY = { movingPlayer: PLAYER_NOT_IN_TURN, x: 1, y: 2 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if movingPlayer is missing', async () => {
    const res = await request(app).put(ROUTE).send({ x: 1, y: 2 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'A player and some coordinates are required' });
    expect(matchService.addMove).not.toHaveBeenCalled();
  });

  it('should return 400 if x coordinate is missing', async () => {
    const res = await request(app).put(ROUTE).send({ movingPlayer: PLAYER_IN_TURN, y: 2 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'A player and some coordinates are required' });
    expect(matchService.addMove).not.toHaveBeenCalled();
  });

  it('should return 400 if y coordinate is missing', async () => {
    const res = await request(app).put(ROUTE).send({ movingPlayer: PLAYER_IN_TURN, x: 1 });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'A player and some coordinates are required' });
    expect(matchService.addMove).not.toHaveBeenCalled();
  });

  it("should return 400 if the moving player can't make a move", async () => {
    jest.mocked(matchService.addMove).mockResolvedValue(false);

    const res = await request(app).put(ROUTE).send(NOT_IN_TURN_BODY);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "This player can't make a move" });
    expect(matchService.addMove).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    jest.mocked(matchService.addMove).mockRejectedValue(new Error('Generic error'));

    const res = await request(app).put(ROUTE).send(IN_TURN_BODY);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    expect(res.body.error).toBeDefined();
  });

  it('should call service.addMove with correct parameters', async () => {
    jest.mocked(matchService.addMove).mockResolvedValue(true);

    await request(app).put(ROUTE).send(IN_TURN_BODY);

    expect(matchService.addMove).toHaveBeenCalledWith(
      MATCH_ID,
      PLAYER_IN_TURN,
      moveFactory.create(1, 2),
    );
  });

  it('should return 200 if move is added successfully', async () => {
    jest.mocked(matchService.addMove).mockResolvedValue(true);

    const res = await request(app).put(ROUTE).send(IN_TURN_BODY);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Move added successfully' });
  });
});

describe('getMatch', () => {
  const ROUTE = `/match/${MATCH_ID}`;
  const DATE = new Date();
  const TEST_MATCH = matchFactory.create(PLAYER_IN_TURN, PLAYER_NOT_IN_TURN, DATE);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if the given ID does not exist', async () => {
    jest.mocked(matchService.getMatch).mockResolvedValue(null);

    const res = await request(app).get(ROUTE);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'This match does not exist' });
    expect(matchService.getMatch).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    jest.mocked(matchService.getMatch).mockRejectedValue(new Error('Generic error'));

    const res = await request(app).get(ROUTE);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    expect(res.body.error).toBeDefined();
  });

  it('should call matchService.getMatch with correct parameters', async () => {
    jest.mocked(matchService.getMatch).mockResolvedValue(TEST_MATCH);

    await request(app).get(ROUTE);

    expect(matchService.getMatch).toHaveBeenCalledWith(MATCH_ID);
  });

  it('should return 200 and the match if it exists', async () => {
    jest.mocked(matchService.getMatch).mockResolvedValue(TEST_MATCH);

    const res = await request(app).get(ROUTE);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: MATCH_ID,
      ...TEST_MATCH,
      // Object must be converted in strings to make the tests pass
      creationDate: TEST_MATCH.creationDate.toISOString(),
    });
  });
});

describe('getMatchesByPlayer', () => {
  const ROUTE = `/match/byplayer/${PLAYER_IN_TURN}`;
  const LIST_OF_IDS = [MATCH_ID, OTHER_ID];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 500 if an error occurs', async () => {
    jest.mocked(matchService.getMatchesByPlayer).mockRejectedValue(new Error('Generic error'));

    const res = await request(app).get(ROUTE);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    expect(res.body.error).toBeDefined();
  });

  it('should call matchService.getMatchesByPlayer with correct parameters', async () => {
    jest.mocked(matchService.getMatchesByPlayer).mockResolvedValue(LIST_OF_IDS);

    await request(app).get(ROUTE);

    expect(matchService.getMatchesByPlayer).toHaveBeenCalledWith(PLAYER_IN_TURN);
  });

  it('should return 200 and a list of matchIDs relative to the given player', async () => {
    jest.mocked(matchService.getMatchesByPlayer).mockResolvedValue(LIST_OF_IDS);

    const res = await request(app).get(ROUTE);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ player: PLAYER_IN_TURN, matchIDs: LIST_OF_IDS });
  });
});

describe('deleteMatch', () => {
  const ROUTE = `/match/${MATCH_ID}/delete`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if the given ID does not exist', async () => {
    jest.mocked(matchService.deleteMatch).mockResolvedValue(false);

    const res = await request(app).delete(ROUTE);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'This match does not exist' });
    expect(matchService.deleteMatch).toHaveBeenCalled();
  });

  it('should return 500 if an error occurs', async () => {
    jest.mocked(matchService.deleteMatch).mockRejectedValue(new Error('Generic error'));

    const res = await request(app).delete(ROUTE);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Internal server error');
    expect(res.body.error).toBeDefined();
  });

  it('should call matchService.deleteMatch with correct parameters', async () => {
    jest.mocked(matchService.deleteMatch).mockResolvedValue(true);

    await request(app).delete(ROUTE);

    expect(matchService.deleteMatch).toHaveBeenCalledWith(MATCH_ID);
  });

  it('should return 200 and the match if it exists', async () => {
    jest.mocked(matchService.deleteMatch).mockResolvedValue(true);

    const res = await request(app).delete(ROUTE);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'The match has been successfully deleted' });
  });
});
