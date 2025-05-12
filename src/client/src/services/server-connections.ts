import axios from 'axios';
import { io } from 'socket.io-client';

let protocol = 'http';
let ip = 'localhost';
let port = 3000;

if (import.meta.env.VITE_DOCKER) {
  console.log('Running in Docker');
  protocol = import.meta.env.VITE_SERVER_PROTOCOL;
  ip = import.meta.env.VITE_SERVER_IP;
  port = import.meta.env.VITE_SERVER_PORT;
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
export const server = axios.create({ baseURL: url, timeout: 10000, headers: { 'Content-Type': 'application/json' } });
server.interceptors.response.use(
  (response) => {
    // Handle successful response
    return response;
  },
  (error) => {
    // Handle error response
    if (error.response) {
      console.error('Error response:', error.response);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);
