import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsNumber,
  Max,
  Min,
  Validate,
  ValidateIf,
} from 'class-validator';
import {
  MAX_LOTTO_NUM,
  MIN_LOTTO_NUM,
  REQUIRED_NUMBERS,
} from '../../constants/simulation.constants';
import { IsUniqueArrayConstraint } from '../../../common/validators/unique-array.validator';

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
