export const api = {
  get: async <T>(_path: string): Promise<T> => ({} as T),
  post: async <T>(_path: string, _body?: unknown): Promise<T> => ({} as T),
};
