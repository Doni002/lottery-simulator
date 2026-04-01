import { io, Socket } from 'socket.io-client';

const SOCKET_URL = window.socket_url.replace(/\/$/, '');

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket'],
    });
  }
  return socket;
};
