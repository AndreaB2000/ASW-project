import { Server, Socket } from 'socket.io';
import * as http from 'http';

let io: Server;

export function initializeIO(server: http.Server) {
  let protocol = 'http';
  let ip = 'localhost';
  let port = '4173';
  if (process.env.DOCKER) {
    protocol = process.env.CLIENT_PROTOCOL;
    ip = process.env.CLIENT_IP;
    port = process.env.CLIENT_PORT;
  }
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? `${protocol}://${ip}:${port}` : 'http://localhost:5173',
      credentials: true,
    },
  });
}

export function getIO(): Server {
  return io;
}

const playerSockets = new Map<string, Socket>();

export function getPlayerSockets(): Map<string, Socket> {
  return playerSockets;
}

export function registerPlayerSocket(username: string, socket: Socket) {
  playerSockets.set(username, socket);
}

export function getPlayerSocket(username: string): Socket | undefined {
  return playerSockets.get(username);
}

export function removePlayerSocket(username: string) {
  playerSockets.delete(username);
}
