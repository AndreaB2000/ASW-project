import axios from 'axios';
import { io } from 'socket.io-client';

let protocol = 'http';
let ip = 'localhost';
let port = 3000;

console.log(import.meta.env);

if (import.meta.env.VITE_DOCKER) {
  console.log('Running in Docker');
  protocol = 'https'; //import.meta.env.VITE_SERVER_PROTOCOL;
  ip = 'sandpiles.com'; //import.meta.env.VITE_SERVER_IP;
  //port = 443;//import.meta.env.VITE_SERVER_PORT;
}

const url = 'https://sandpiles.com/api'; // `${protocol}://${ip}/api`;
console.log(`[API URL]: ${url}/`);

/**
 * Axios instance for making HTTP requests to the server.
 */
export const server = axios.create({ baseURL: url, timeout: 10000, withCredentials: true });

/**
 * Socket connection to the server with authentication
 */
export let socket = io(`${url}/auth`, {
  withCredentials: true,
  forceNew: true,
});

socket.on('connect_error', error => {
  console.log(error);
  console.warn('Auth connection failed, falling back to unauthenticated namespace');
  // Fallback to unauthenticated root namespace
  socket = io(url, { withCredentials: true });
});

/**
 * Attempts to connect to the authentication namespace.
 */
export const tryAuth = () => {
  socket.disconnect();
  socket = io(`${url}/auth`, {
    withCredentials: true,
    forceNew: true,
  });
};
