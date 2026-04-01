import { api } from '../../../services/api';
import type {
  CreateSessionResponse,
  StartSimulationResponse,
  StopSimulationResponse,
} from '../types/simulation.types';

type CreateSessionRequest = {
  drawSpeed: number;
  randomSeedEnabled: boolean;
  customNumbers?: number[];
};

export const simulationApi = {
  createSession: async (
    drawSpeed: number,
    randomSeedEnabled: boolean,
    customNumbers?: number[],
  ): Promise<CreateSessionResponse> => {
    const payload: CreateSessionRequest = {
      drawSpeed,
      randomSeedEnabled,
      ...(randomSeedEnabled ? {} : { customNumbers }),
    };

    return api.post<CreateSessionResponse>('/simulation/session', payload);
  },

  startSimulation: async (sessionId: string): Promise<StartSimulationResponse> =>
    api.post<StartSimulationResponse>(`/simulation/session/${sessionId}/start`),

  stopSimulation: async (sessionId: string): Promise<StopSimulationResponse> =>
    api.post<StopSimulationResponse>(`/simulation/session/${sessionId}/stop`),

  updateDrawSpeed: async (sessionId: string, drawSpeed: number): Promise<void> =>
    api.patch(`/simulation/session/${sessionId}/draw-speed`, { drawSpeed }),
};
