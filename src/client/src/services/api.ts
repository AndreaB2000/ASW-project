import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

if (import.meta.env.DEV) {
  process.env.SERVER_IP = 'localhost';
} else if (import.meta.env.PROD) {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
}

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
 * This is the API client for the application.
 * It uses axios to make HTTP requests to the backend server.
 */
export const api = axios.create({ baseURL: `${protocol}://${ip}:${port}/` });
