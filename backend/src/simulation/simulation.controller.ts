import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { SimulationService } from './services/simulation.service';
import { CreateSessionDto } from 'src/simulation/dto/requests/create-session.dto';
import { UpdateDrawSpeedDto } from 'src/simulation/dto/requests/update-draw-speed.dto';
import {
  CreateSessionResponse,
  StartSimulationResponse,
  StopSimulationResponse,
} from 'src/simulation/dto/responses/simulation.response.dto';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('session')
  async createSession(@Body() dto: CreateSessionDto): Promise<CreateSessionResponse> {
    const session = await this.simulationService.createSession(dto);
    return { session };
  }

  @Patch('session/:id/draw-speed')
  async updateDrawSpeed(
    @Param('id') sessionId: string,
    @Body() dto: UpdateDrawSpeedDto,
  ): Promise<CreateSessionResponse> {
    const session = await this.simulationService.updateDrawSpeed(sessionId, dto);
    return { session };
  }

  @Post('session/:id/start')
  async startSimulation(
    @Param('id') sessionId: string,
  ): Promise<StartSimulationResponse> {
    return this.simulationService.startSimulation(sessionId);
  }

  @Post('session/:id/stop')
  async stopSimulation(
    @Param('id') sessionId: string,
  ): Promise<StopSimulationResponse> {
    return this.simulationService.stopSimulation(sessionId);
  }
}
