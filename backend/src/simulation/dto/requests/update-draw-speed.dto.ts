import { IsInt, Max, Min } from 'class-validator';
import {
  MAX_DRAW_SPEED_MS,
  MIN_DRAW_SPEED_MS,
} from '../../constants/simulation.constants';

export class UpdateDrawSpeedDto {
  @IsInt()
  @Min(MIN_DRAW_SPEED_MS)
  @Max(MAX_DRAW_SPEED_MS)
  drawSpeed: number;
}
