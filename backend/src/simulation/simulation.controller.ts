import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { SimulationService } from './services/simulation.service';
import { CreateSessionDto } from 'src/simulation/dto/requests/create-session.dto';
import { UpdateCustomNumbersDto } from 'src/simulation/dto/requests/update-custom-numbers.dto';
import { UpdateDrawSpeedDto } from 'src/simulation/dto/requests/update-draw-speed.dto';
import { UpdateRandomSeedDto } from 'src/simulation/dto/requests/update-random-seed.dto';
import {
  CreateSessionResponse,
  SessionDetailsResponse,
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

  @Get('session/:id')
  async getSession(@Param('id') sessionId: string): Promise<SessionDetailsResponse> {
    const session = await this.simulationService.getSession(sessionId);
    return { session };
  }

  @Patch('session/:id/custom-numbers')
  async updateCustomNumbers(
    @Param('id') sessionId: string,
    @Body() dto: UpdateCustomNumbersDto,
  ): Promise<SessionDetailsResponse> {
    const session = await this.simulationService.updateCustomNumbers(
      sessionId,
      dto,
    );
    return { session };
  }

  @Patch('session/:id/random-seed')
  async updateRandomSeed(
    @Param('id') sessionId: string,
    @Body() dto: UpdateRandomSeedDto,
  ): Promise<SessionDetailsResponse> {
    const session = await this.simulationService.updateRandomSeed(
      sessionId,
      dto,
    );
    return { session };
  }

  @Patch('session/:id/draw-speed')
  async updateDrawSpeed(
    @Param('id') sessionId: string,
    @Body() dto: UpdateDrawSpeedDto,
  ): Promise<SessionDetailsResponse> {
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
