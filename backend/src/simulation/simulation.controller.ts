import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSessionDto } from 'src/common/dto/session.dto';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('session')
  async createSession(@Body() dto: CreateSessionDto) {
    const session = await this.simulationService.createSession(dto);
    return { session };
  }

  @Get('session/:id')
  async getSession(@Param('id') sessionId: string) {
    const session = await this.simulationService.getSession(sessionId);
    return { session };
  }

  @Post('session/:id/draw')
  async generateDraw(@Param('id') sessionId: string) {
    const draw = await this.simulationService.runSimulationStep(sessionId);
    return { draw };
  }
}
