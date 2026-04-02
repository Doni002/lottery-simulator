import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { StartSimulationParams } from './useSimulation';
import { useSimulation } from './useSimulation';
import { simulationApi } from '../api/simulation.api';
import { useSimulationSocket } from './useSimulationSocket';

vi.mock('../api/simulation.api', () => ({
  simulationApi: {
    createSession: vi.fn(),
    startSimulation: vi.fn(),
    stopSimulation: vi.fn(),
    updateDrawSpeed: vi.fn(),
  },
}));

vi.mock('./useSimulationSocket', () => ({
  useSimulationSocket: vi.fn(),
}));

const mockedApi = vi.mocked(simulationApi);
const mockedUseSimulationSocket = vi.mocked(useSimulationSocket);

describe('useSimulation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a session and starts simulation successfully', async () => {
    const params: StartSimulationParams = {
      drawSpeed: 750,
      randomSeedEnabled: true,
    };

    mockedApi.createSession.mockResolvedValueOnce({
      session: { id: 'session-1' },
    });
    mockedApi.startSimulation.mockResolvedValueOnce({
      accepted: true,
      message: 'started',
    });

    const { result } = renderHook(() => useSimulation());

    let started = false;
    await act(async () => {
      started = await result.current.start(params);
    });

    expect(started).toBe(true);
    expect(result.current.sessionId).toBe('session-1');
    expect(result.current.isRunning).toBe(true);
    expect(result.current.error).toBeNull();
    expect(mockedApi.createSession).toHaveBeenCalledWith(750, true, undefined);
    expect(mockedApi.startSimulation).toHaveBeenCalledWith('session-1');
  });

  it('sets error and returns false when backend rejects start', async () => {
    mockedApi.createSession.mockResolvedValueOnce({
      session: { id: 'session-1' },
    });
    mockedApi.startSimulation.mockResolvedValueOnce({
      accepted: false,
      message: 'already running',
    });

    const { result } = renderHook(() => useSimulation());

    let started = true;
    await act(async () => {
      started = await result.current.start({ drawSpeed: 750, randomSeedEnabled: true });
    });

    expect(started).toBe(false);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.error).toBe('already running');
  });

  it('returns false without calling API when stop is called before a session exists', async () => {
    const { result } = renderHook(() => useSimulation());

    let stopped = true;
    await act(async () => {
      stopped = await result.current.stop();
    });

    expect(stopped).toBe(false);
    expect(mockedApi.stopSimulation).not.toHaveBeenCalled();
  });

  it('updates error and running state from socket error callback', async () => {
    let socketCallbacks: Parameters<typeof useSimulationSocket>[0] | undefined;

    mockedUseSimulationSocket.mockImplementation((callbacks) => {
      socketCallbacks = callbacks;
    });

    const { result } = renderHook(() => useSimulation());

    mockedApi.createSession.mockResolvedValueOnce({
      session: { id: 'session-2' },
    });
    mockedApi.startSimulation.mockResolvedValueOnce({
      accepted: true,
      message: 'started',
    });

    await act(async () => {
      await result.current.start({ drawSpeed: 750, randomSeedEnabled: true });
    });

    const callbacks = socketCallbacks;
    expect(callbacks).toBeDefined();
    if (!callbacks) {
      throw new Error('Expected socket callbacks to be registered');
    }
    expect(callbacks.onError).toBeTypeOf('function');

    await act(async () => {
      callbacks.onError?.({ message: 'socket disconnected' });
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.error).toBe('socket disconnected');
  });

  it('does not call updateDrawSpeed API until a session exists', async () => {
    const { result } = renderHook(() => useSimulation());

    await act(async () => {
      await result.current.updateDrawSpeed(300);
    });

    expect(mockedApi.updateDrawSpeed).not.toHaveBeenCalled();
  });
});
