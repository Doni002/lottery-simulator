import { IsBoolean } from 'class-validator';

export class UpdateRandomSeedDto {
  @IsBoolean()
  randomSeedEnabled: boolean;
}
