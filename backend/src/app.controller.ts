import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  calculateMatches,
  generateUniqueNumbers,
} from './common/utils/simulation.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test/generate-numbers')
  getTestNumbers(): { numbers: number[] } {
    const numbers = generateUniqueNumbers();
    return { numbers };
  }

  @Get('test/calculate-matches')
  getTestMatches(): {
    winningNumbers: number[];
    ticketNumbers: number[];
    matches: { matchCount: number; matchingNumbers: number[] };
  } {
    const winningNumbers = generateUniqueNumbers();
    const ticketNumbers = generateUniqueNumbers();
    const matches = calculateMatches(winningNumbers, ticketNumbers);

    return {
      winningNumbers,
      ticketNumbers,
      matches,
    };
  }
}
