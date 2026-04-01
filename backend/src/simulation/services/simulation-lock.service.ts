import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SimulationLockService {
  private readonly pauseRequests = new Set<string>();
  private readonly liveDrawSpeeds = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  async tryAcquireSimulationLock(sessionId: string) {
    const updateResult = await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        simulationRunning: false,
      },
      data: {
        simulationRunning: true,
        simulationStartedAt: new Date(),
      },
    });

    if (updateResult.count === 1) {
      return {
        acquired: true,
        message: 'Simulation lock acquired',
      } as const;
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (!session) {
      return {
        acquired: false,
        message: 'Session not found',
      } as const;
    }

    return {
      acquired: false,
      message: 'A simulation is already running for this session',
    } as const;
  }

  async releaseSimulationLock(sessionId: string) {
    await this.prisma.session.updateMany({
      where: {
        id: sessionId,
      },
      data: {
        simulationRunning: false,
        simulationStartedAt: null,
      },
    });

    this.pauseRequests.delete(sessionId);
    this.liveDrawSpeeds.delete(sessionId);
  }

  requestPause(sessionId: string): void {
    this.pauseRequests.add(sessionId);
  }

  isPauseRequested(sessionId: string): boolean {
    return this.pauseRequests.has(sessionId);
  }

  clearPauseRequest(sessionId: string): void {
    this.pauseRequests.delete(sessionId);
  }

  setLiveDrawSpeed(sessionId: string, drawSpeed: number): void {
    this.liveDrawSpeeds.set(sessionId, drawSpeed);
  }

  getLiveDrawSpeed(sessionId: string, fallback: number): number {
    return this.liveDrawSpeeds.get(sessionId) ?? fallback;
  }
}
