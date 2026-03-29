import { Injectable } from '@nestjs/common';

@Injectable()
export class SimulationEngine {

  generateUniqueNumbers(count = 5, maxNumber = 90): number[] {
    if (count <= 0 || count > maxNumber) {
      throw new Error('count must be between 1 and maxNumber');
    }

    const numbers: number[] = [];
    const pool = Array.from({ length: maxNumber }, (_, i) => i + 1);

    while (numbers.length < count) {
      const index = Math.floor(Math.random() * pool.length);
      numbers.push(pool.splice(index, 1)[0]);
    }

    return numbers;
  }
}