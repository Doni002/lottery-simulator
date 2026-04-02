import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('api service', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
    window.api_base_url = 'http://localhost:3000/';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends POST requests with JSON body and normalized URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { api } = await import('./api');

    const response = await api.post<{ ok: boolean }>('/simulation/session', {
      drawSpeed: 500,
    });

    expect(response).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/simulation/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drawSpeed: 500 }),
    });
  });

  it('does not send body for GET requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ value: 1 }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { api } = await import('./api');

    await api.get<{ value: number }>('health');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/health', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    });
  });

  it('joins array backend messages into one Error message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ message: ['a', 'b'] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { api } = await import('./api');

    await expect(api.post('/simulation/session')).rejects.toThrow('a, b');
  });

  it('uses plain text body as error message when response is not JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Server exploded',
    });
    vi.stubGlobal('fetch', fetchMock);

    const { api } = await import('./api');

    await expect(api.get('/boom')).rejects.toThrow('Server exploded');
  });
});
