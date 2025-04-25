import axios from 'axios';

/**
 * This is the API client for the application.
 * It uses axios to make HTTP requests to the backend server.
 */
export const api = axios.create({
  baseURL: 'http://localhost:3000/',
});
