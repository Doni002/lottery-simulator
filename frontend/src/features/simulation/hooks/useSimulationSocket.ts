interface UseSimulationSocketOptions {
  sessionId?: string;
  onProgress?: (_payload: unknown) => void;
  onComplete?: (_payload: unknown) => void;
  onError?: (_payload: unknown) => void;
}

export function useSimulationSocket({
  sessionId,
  onProgress,
  onComplete,
  onError,
}: UseSimulationSocketOptions): void {
  void sessionId;
  void onProgress;
  void onComplete;
  void onError;
}
