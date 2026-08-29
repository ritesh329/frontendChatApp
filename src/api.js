import axios from 'axios';

/* =========================================================================
   CONFIG — adjust these two lines if your backend uses different paths/port
   ========================================================================= */
export const API_BASE = 'https://chat-app-shoh.onrender.com/api';   // REST base
export const SOCKET_URL = 'https://chat-app-shoh.onrender.com';     // Socket.io base

// Mutable token holder used by the axios interceptor (mirrors the original
// vanilla-JS `state.token` closure behaviour).
let currentToken = localStorage.getItem('chat_token') || null;

export function setAuthToken(token) {
  currentToken = token;
}

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((cfg) => {
  if (currentToken) cfg.headers.Authorization = `Bearer ${currentToken}`;
  return cfg;
});
