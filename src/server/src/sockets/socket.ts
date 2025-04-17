import { Server } from 'socket.io';
import * as http from 'http';

let io: Server;

export function initializeIO(server: http.Server) {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
    },
  });
}

export function getIO(): Server {
  return io;
}

const playerSockets = new Map<string, string>(); // playerId -> socketId

export function registerPlayerSocket(playerId: string, socketId: string) {
  playerSockets.set(playerId, socketId);
}

export function getPlayerSocket(playerId: string): string | undefined {
  return playerSockets.get(playerId);
}

export function removePlayerSocket(playerId: string) {
  playerSockets.delete(playerId);
}
