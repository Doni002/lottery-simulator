const API_BASE_URL = window.api_base_url.replace(/\/$/, '');

type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function toErrorMessage(status: number, payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return `Request failed with status ${status}`;
  }

  const message = (payload as { message?: unknown }).message;

  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;

  return `Request failed with status ${status}`;
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

async function request<T>(method: ApiMethod, path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method,
    headers: getHeaders(),
    body: method === 'GET' ? undefined : JSON.stringify(body),
  });

  const text = await response.text();

  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(toErrorMessage(response.status, payload));
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};