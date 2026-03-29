import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SimulationController],
  providers: [SimulationService, PrismaService],
  exports: [SimulationService],
})
export class SimulationModule {}
