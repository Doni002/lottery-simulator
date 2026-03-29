import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { SimulationEngine } from './simulation-engine/simulation-engine';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, SimulationEngine],
})
export class AppModule {}
