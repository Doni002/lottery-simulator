import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUniqueArray', async: false })
export class IsUniqueArrayConstraint implements ValidatorConstraintInterface {
  validate(arr: any[]) {
    if (!Array.isArray(arr)) return false;
    return new Set(arr).size === arr.length;
  }
  defaultMessage(args: ValidationArguments) {
    return `${args.property} must not contain duplicate values`;
  }
}
