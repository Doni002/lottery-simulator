import { IsInt, Max, Min } from 'class-validator';

export class UpdateDrawSpeedDto {
  @IsInt()
  @Min(10)
  @Max(1000)
  drawSpeed: number;
}
