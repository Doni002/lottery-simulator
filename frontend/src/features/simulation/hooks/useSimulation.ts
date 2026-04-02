import { useCallback, useState } from 'react';
import { simulationApi } from '../api/simulation.api';
import { useSimulationSocket } from './useSimulationSocket';
import type {
  SimulationCompletePayload,
  SimulationProgressPayload,
} from '../types/simulation.types';

export type StartSimulationParams = {
  drawSpeed: number;
  randomSeedEnabled: boolean;
  customNumbers?: number[];
};

export function useSimulation() {
  const isDev = import.meta.env.DEV;
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<SimulationProgressPayload | null>(null);
  const [completion, setCompletion] = useState<SimulationCompletePayload | null>(null);

  const handleProgress = useCallback((payload: SimulationProgressPayload) => {
    setProgress(payload);
    setCompletion(null);
  }, []);

  const handleComplete = useCallback((payload: SimulationCompletePayload) => {
    setProgress(payload);
    setCompletion(payload);
    setIsRunning(false);
  }, []);

  const handleError = useCallback((payload: { message: string }) => {
    setError(payload.message);
    setIsRunning(false);
  }, []);

  const handlePaused = useCallback(() => {
    setIsRunning(false);
    setError(null);
  }, []);

  useSimulationSocket({
    sessionId: sessionId ?? undefined,
    onProgress: handleProgress,
    onComplete: handleComplete,
    onPaused: handlePaused,
    onError: handleError,
  });

  const start = useCallback(async (params: StartSimulationParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setCompletion(null);

    try {
      let activeSessionId = sessionId;

      if (!activeSessionId) {
        const createSessionResponse = await simulationApi.createSession(
          params.drawSpeed,
          params.randomSeedEnabled,
          params.customNumbers,
        );

        activeSessionId = createSessionResponse.session.id;
        setSessionId(activeSessionId);
      }

      const startResponse = await simulationApi.startSimulation(activeSessionId);

      if (!startResponse.accepted) {
        setIsRunning(false);
        setError(startResponse.message);
        return false;
      }

      setIsRunning(true);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start simulation';
      setIsRunning(false);
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const stop = useCallback(async (): Promise<boolean> => {
    if (!sessionId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const stopResponse = await simulationApi.stopSimulation(sessionId);

      if (!stopResponse.accepted) {
        setError(stopResponse.message);
        return false;
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop simulation';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const updateDrawSpeed = useCallback(async (drawSpeed: number): Promise<void> => {
    if (!sessionId) {
      if (isDev) {
        console.warn('[useSimulation] skipped draw speed update: no active session', {
          drawSpeed,
        });
      }
      return;
    }

    if (isDev) {
      console.log('[useSimulation] sending draw speed update', {
        sessionId,
        drawSpeed,
      });
    }

    try {
      await simulationApi.updateDrawSpeed(sessionId, drawSpeed);

      if (isDev) {
        console.log('[useSimulation] draw speed update succeeded', {
          sessionId,
          drawSpeed,
        });
      }
    } catch (err) {
      if (isDev) {
        console.error('[useSimulation] draw speed update failed', {
          sessionId,
          drawSpeed,
          error: err,
        });
      }

      throw err;
    }
  }, [isDev, sessionId]);

  return { sessionId, isRunning, isLoading, error, progress, completion, start, stop, updateDrawSpeed };
}
