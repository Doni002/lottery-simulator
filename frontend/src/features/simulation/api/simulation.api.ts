import type { CreateSessionResponse, StartSimulationResponse } from '../types/simulation.types';

export const simulationApi = {
  createSession: async (
    _drawSpeed: number,
    _randomSeedEnabled: boolean,
  ): Promise<CreateSessionResponse> => ({
    session: {
      id: 'simulation-session',
    },
  }),

  startSimulation: async (_sessionId: string): Promise<StartSimulationResponse> => ({
    accepted: false,
    message: 'Simulation API skeleton',
  }),
};
