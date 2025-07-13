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
  const origin: string = 'https://sandpiles.com'; // `${protocol}://${ip}${!port ? '' : ':' + port}`;
  console.log('CORSSSSSSSSSSS', origin);
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? origin : 'http://localhost:5173',
      credentials: true,
    },
  });
}

export function getIO(): Server {
  return io;
}

export function emitToRoom(room: string, event: string, ...data: any[]) {
  if (io.sockets.adapter.rooms.get(room) != undefined) {
    io.to(room).emit(event, ...data);
  } else {
    io.of('/auth')
      .to(room)
      .emit(event, ...data);
  }
}

export function socketsLeave(room: string) {
  if (io.sockets.adapter.rooms.get(room) != undefined) {
    io.socketsLeave(room);
  } else {
    io.of('/auth').socketsLeave(room);
  }
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

export function getSocketUsername(socket: Socket): string | undefined {
  let ret: string | undefined = undefined;
  playerSockets.forEach((sock, username) => {
    if (socket == sock) {
      ret = username;
    }
  });
  return ret;
}

export function removePlayerSocket(username: string) {
  playerSockets.delete(username);
}
