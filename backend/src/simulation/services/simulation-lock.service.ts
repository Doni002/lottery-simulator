import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SimulationLockService {
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
  }
}
