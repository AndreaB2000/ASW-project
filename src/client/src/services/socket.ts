import { io } from 'socket.io-client';

let ip = 'localhost';
let port = 3000;
let protocol = 'http';

if (import.meta.env.PROD) {
  ip = import.meta.env.VITE_SERVER_IP;
  port = import.meta.env.VITE_SERVER_PORT;
  protocol = import.meta.env.VITE_SERVER_PROTOCOL;
} else if (!import.meta.env.DEV) {
  throw new Error('Unknown environment: ' + import.meta.env);
}
console.log(`[API URL]: ${protocol}://${ip}:${port}/`);

/**
 * Socket connection to the server
 */
export const socket = io(`${protocol}://${ip}:${port}`);
