type SocketSkeleton = {
  connected: boolean;
  connect: () => void;
  emit: (_event: string, _payload?: unknown) => void;
  on: (_event: string, _handler?: (_payload: unknown) => void) => void;
  off: (_event: string) => void;
};

const socket: SocketSkeleton = {
  connected: false,
  connect: () => {},
  emit: (_event: string, _payload?: unknown) => {},
  on: (_event: string, _handler?: (_payload: unknown) => void) => {},
  off: (_event: string) => {},
};

export function getSocket(): SocketSkeleton {
  return socket;
}
