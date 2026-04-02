import { MAX_SIMULATION_DRAWS } from '../constants/simulation.constants';
import { SimulationService } from './simulation.service';
import * as numberUtils from '../utils/simulation-number.utils';

describe('SimulationService', () => {
  const sessionId = 'session-1';

  const lockService = {
    tryAcquireSimulationLock: jest.fn(),
    releaseSimulationLock: jest.fn(),
    requestPause: jest.fn(),
    setLiveDrawSpeed: jest.fn(),
    isPauseRequested: jest.fn(),
    clearPauseRequest: jest.fn(),
    getLiveDrawSpeed: jest.fn(),
  };

  const sessionService = {
    createSession: jest.fn(),
    updateDrawSpeed: jest.fn(),
    getSessionForSimulation: jest.fn(),
  };

  const persistenceService = {
    calculatePersistedMatchSummary: jest.fn(),
    persistWinningDrawAndTicket: jest.fn(),
  };

  const gateway = {
    executeSimulationRun: jest.fn(),
  };

  let service: SimulationService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new SimulationService(
      lockService as any,
      sessionService as any,
      persistenceService as any,
      gateway as any,
    );

    sessionService.getSessionForSimulation.mockResolvedValue({
      customNumbers: [1, 2, 3, 4, 5],
      randomSeedEnabled: false,
      drawSpeed: 0,
    });

    persistenceService.calculatePersistedMatchSummary.mockResolvedValue({
      twoMatches: 0,
      threeMatches: 0,
      fourMatches: 0,
      fiveMatches: 0,
    });

    lockService.getLiveDrawSpeed.mockReturnValue(0);
    lockService.isPauseRequested.mockReturnValue(false);
  });

  it('stops immediately on jackpot (5 matches)', async () => {
    jest
      .spyOn(numberUtils, 'generateUniqueNumbers')
      .mockReturnValue([1, 2, 3, 4, 5]);

    const onProgress = jest.fn();

    const result = await service.runSimulationUntilStop(sessionId, onProgress);

    expect(result).toMatchObject({
      sessionId,
      stopReason: 'fiveMatchHit',
      totalDrawsRun: 1,
      matchCount: 5,
    });
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(persistenceService.persistWinningDrawAndTicket).toHaveBeenCalledTimes(1);
  });

  it('returns paused when stop is requested', async () => {
    jest
      .spyOn(numberUtils, 'generateUniqueNumbers')
      .mockReturnValue([6, 7, 8, 9, 10]);

    lockService.isPauseRequested.mockReturnValue(true);

    const onProgress = jest.fn();

    const result = await service.runSimulationUntilStop(sessionId, onProgress);

    expect(result).toEqual({ sessionId, message: 'Simulation paused' });
    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(lockService.clearPauseRequest).toHaveBeenCalledWith(sessionId);
  });

  it('stops after max simulation draws when no jackpot is hit', async () => {
    jest
      .spyOn(numberUtils, 'generateUniqueNumbers')
      .mockReturnValue([6, 7, 8, 9, 10]);

    const onProgress = jest.fn();

    const result = await service.runSimulationUntilStop(sessionId, onProgress);

    expect(result).toMatchObject({
      sessionId,
      stopReason: 'maxYearsReached',
      totalDrawsRun: MAX_SIMULATION_DRAWS,
      drawIndex: MAX_SIMULATION_DRAWS,
    });
    expect(onProgress).toHaveBeenCalledTimes(MAX_SIMULATION_DRAWS);
  });
});
