import { Server, Socket } from 'socket.io';
import * as http from 'http';
import { authenticateTokenSocket } from '../middlewares/auth';

let io: Server;

export function initializeIO(server: http.Server) {
  io = new Server(server, {
    cors: { origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_IP : '*' },
  });
  io.use(authenticateTokenSocket);
}

export function getIO(): Server {
  return io;
}

const playerSockets = new Map<string, Socket>(); // playerId -> socketId

export function registerPlayerSocket(playerId: string, socketId: Socket) {
  playerSockets.set(playerId, socketId);
}

export function getPlayerSocket(playerId: string): Socket | undefined {
  return playerSockets.get(playerId);
}

export function removePlayerSocket(playerId: string) {
  playerSockets.delete(playerId);
}
