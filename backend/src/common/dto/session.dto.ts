import {
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  IsInt,
  IsNumber,
  Max,
  Min,
  ValidateIf,
  Validate,
} from 'class-validator';
import { IsUniqueArrayConstraint } from '../validators/unique-array.validator';
import {
  MIN_LOTTO_NUM,
  MAX_LOTTO_NUM,
  REQUIRED_NUMBERS,
} from '../constants/lottery.constants';

export class CreateSessionDto {
  @IsInt()
  @Min(10)
  @Max(1000)
  drawSpeed: number;

  @IsBoolean()
  randomSeedEnabled: boolean;

  @ValidateIf((o) => o.randomSeedEnabled === false)
  @ArrayMinSize(REQUIRED_NUMBERS)
  @ArrayMaxSize(REQUIRED_NUMBERS)
  @IsNumber({}, { each: true })
  @Min(MIN_LOTTO_NUM, { each: true })
  @Max(MAX_LOTTO_NUM, { each: true })
  @Validate(IsUniqueArrayConstraint, {
    message: 'customNumbers must not contain duplicate values',
  })
  customNumbers?: number[];
}
