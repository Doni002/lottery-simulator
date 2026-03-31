export function useSimulation(sessionId: string) {
  void sessionId;

  const start = async (): Promise<void> => {};
  const stop = (): void => {};

  return { isRunning: false, error: null as string | null, start, stop };
}
