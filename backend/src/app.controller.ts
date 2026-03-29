import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SimulationEngine } from './simulation-engine/simulation-engine';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly simulationEngine: SimulationEngine,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/generate-numbers')
  getTestNumbers(): { numbers: number[] } {
    const numbers = this.simulationEngine.generateUniqueNumbers();
    return { numbers };
  }
}
