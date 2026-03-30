import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
  Max,
  Min,
  Validate,
} from 'class-validator';
import {
  MAX_LOTTO_NUM,
  MIN_LOTTO_NUM,
  REQUIRED_NUMBERS,
} from '../../constants/simulation.constants';
import { IsUniqueArrayConstraint } from '../../../common/validators/unique-array.validator';

export class UpdateCustomNumbersDto {
  @ArrayMinSize(REQUIRED_NUMBERS)
  @ArrayMaxSize(REQUIRED_NUMBERS)
  @IsNumber({}, { each: true })
  @Min(MIN_LOTTO_NUM, { each: true })
  @Max(MAX_LOTTO_NUM, { each: true })
  @Validate(IsUniqueArrayConstraint, {
    message: 'customNumbers must not contain duplicate values',
  })
  customNumbers: number[];
}
