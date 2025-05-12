import axios from 'axios';
import { io } from 'socket.io-client';

let protocol = 'http';
let ip = 'localhost';
let port = 3000;

if (import.meta.env.PROD) {
  protocol = import.meta.env.VITE_SERVER_PROTOCOL;
  ip = import.meta.env.VITE_SERVER_IP;
  port = import.meta.env.VITE_SERVER_PORT;
} else if (!import.meta.env.DEV) {
  throw new Error('Unknown environment: ' + import.meta.env);
}

const url = `${protocol}://${ip}:${port}`;

console.log(`[API URL]: ${url}/`);

/**
 * Socket connection to the server
 */
export const socket = io(url);

/**
 * Axios instance for making HTTP requests to the server.
 */
export const server = axios.create({ baseURL: url });
