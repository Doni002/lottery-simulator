import { useEffect, useRef } from 'react';
import { getSocket } from '../../../services/socket';
import type {
  SimulationCompletePayload,
  SimulationErrorPayload,
  SimulationProgressPayload,
} from '../types/simulation.types';

interface UseSimulationSocketOptions {
  sessionId?: string;
  onProgress?: (payload: SimulationProgressPayload) => void;
  onComplete?: (payload: SimulationCompletePayload) => void;
  onError?: (payload: SimulationErrorPayload) => void;
}

export function useSimulationSocket({
  sessionId,
  onProgress,
  onComplete,
  onError,
}: UseSimulationSocketOptions): void {
  const onProgressRef = useRef(onProgress);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  onProgressRef.current = onProgress;
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!sessionId) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleProgress = (payload: SimulationProgressPayload) => {
      onProgressRef.current?.(payload);
    };

    const handleComplete = (payload: SimulationCompletePayload) => {
      onCompleteRef.current?.(payload);
    };

    const handleError = (payload: SimulationErrorPayload) => {
      onErrorRef.current?.(payload);
    };

    socket.on('simulationProgress', handleProgress);
    socket.on('simulationComplete', handleComplete);
    socket.on('simulationError', handleError);

    socket.emit('subscribeSession', { sessionId });

    return () => {
      socket.off('simulationProgress', handleProgress);
      socket.off('simulationComplete', handleComplete);
      socket.off('simulationError', handleError);

      socket.emit('unsubscribeSession', { sessionId });
    };
  }, [sessionId]);
}