import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from '../dto/requests/create-session.dto';
import { UpdateDrawSpeedDto } from '../dto/requests/update-draw-speed.dto';
import { DEFAULT_DRAW_SPEED_MS } from '../constants/simulation.constants';
import { SimulationSession } from '../types/simulation.types';
import { toNumberArray } from '../utils/simulation-number.utils';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SimulationSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(dto: CreateSessionDto) {
    const randomSeedEnabled = dto.randomSeedEnabled ?? true;

    return this.prisma.session.create({
      data: {
        drawSpeed: dto.drawSpeed ?? DEFAULT_DRAW_SPEED_MS,
        randomSeedEnabled,
        customNumbers: dto.customNumbers ?? undefined,
      },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        tickets: true,
        draws: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async getSessionForSimulation(sessionId: string): Promise<SimulationSession> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { customNumbers: true, randomSeedEnabled: true, drawSpeed: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return {
      randomSeedEnabled: session.randomSeedEnabled,
      customNumbers: Array.isArray(session.customNumbers)
        ? toNumberArray(session.customNumbers)
        : null,
      drawSpeed: session.drawSpeed,
    };
  }

  async updateDrawSpeed(sessionId: string, dto: UpdateDrawSpeedDto) {
    const updateResult = await this.prisma.session.updateMany({
      where: { id: sessionId },
      data: {
        drawSpeed: dto.drawSpeed,
      },
    });

    if (updateResult.count === 0) {
      throw new NotFoundException('Session not found');
    }

    return this.getSession(sessionId);
  }
}
