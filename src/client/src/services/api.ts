import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

if (import.meta.env.DEV) {
  process.env.SERVER_IP = 'localhost';
} else if (import.meta.env.PROD) {
  dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
}

/**
 * This is the API client for the application.
 * It uses axios to make HTTP requests to the backend server.
 */
export const api = axios.create({
  baseURL: `http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/`,
});
