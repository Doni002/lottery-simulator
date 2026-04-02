import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './services/simulation.service';
import { PrismaService } from '../prisma/prisma.service';
import { SimulationGateway } from './simulation.gateway';
import { SimulationLockService } from './services/simulation-lock.service';
import { SimulationSessionService } from './services/simulation-session.service';
import { SimulationPersistenceService } from './services/simulation-persistence.service';

@Module({
  controllers: [SimulationController],
  providers: [
    SimulationService,
    SimulationLockService,
    SimulationSessionService,
    SimulationPersistenceService,
    PrismaService,
    SimulationGateway,
  ],
  exports: [SimulationService, PrismaService],
})
export class SimulationModule {}
