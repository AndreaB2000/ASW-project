import axios from 'axios';
import { io } from 'socket.io-client';

let protocol = 'http';
let ip = 'localhost';
let port: number | null = 3000;

if (import.meta.env.VITE_DOCKER) {
  console.log('Running in Docker');
  protocol = import.meta.env.VITE_SERVER_PROTOCOL;
  ip = import.meta.env.VITE_SERVER_IP;
  port = null;
}

const baseUrl: string = `${protocol}://${ip}${!port ? '' : ':' + port}`;
const serverBasePath: string = ip === 'localhost' ? '' : '/api';
console.log(`[API URL]: ${baseUrl}/`);

/**
 * Axios instance for making HTTP requests to the server.
 */
export const server = axios.create({
  baseURL: `${baseUrl}${serverBasePath}`,
  timeout: 10000,
  withCredentials: true,
});

/**
 * Socket connection to the server with authentication
 */
export let socket = io(`${baseUrl}/auth`, {
  path: `${serverBasePath}/socket.io`,
  withCredentials: true,
  forceNew: true,
});

socket.on('connect_error', error => {
  console.log(error);
  console.warn('Auth connection failed, falling back to unauthenticated namespace');
  // Fallback to unauthenticated root namespace
  socket = io(baseUrl, {
    withCredentials: true,
    forceNew: true,
    path: `${serverBasePath}/socket.io`,
  });
});

/**
 * Attempts to connect to the authentication namespace.
 */
export const tryAuth = () => {
  socket.disconnect();
  socket = io(`${baseUrl}/auth`, {
    path: `${serverBasePath}/socket.io`,
    withCredentials: true,
    forceNew: true,
  });
};
