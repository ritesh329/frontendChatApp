import axios from 'axios';

export const API_BASE = 'https://chat-app-shoh.onrender.com/api';   
export const SOCKET_URL = 'https://chat-app-shoh.onrender.com';    
let currentToken = localStorage.getItem('chat_token') || null;

export function setAuthToken(token) {
  currentToken = token;
}

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  if (currentToken) cfg.headers.Authorization = `Bearer ${currentToken}`;
  return cfg;
});
