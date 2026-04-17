import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const socket = io(BACKEND_URL, {
  autoConnect: false, // We'll connect manually when the user is authenticated
});