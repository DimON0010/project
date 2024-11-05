import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import Big from "big.js";

import { Keno } from "../strategy/keno";
import { KenoRisk } from "../strategy/keno.types";

@ValidatorConstraint({ name: "customBigPredicate", async: false })
export class CustomBigPredicateValidator
  implements ValidatorConstraintInterface
{
  validate(number: string, args: ValidationArguments) {
    const [op, value] = args.constraints as [string, string];
    return Big(number)[op](value);
  }

  defaultMessage() {
    return "The number ($value) did not pass the validation";
  }
}

export class KenoBetDto {
  @Validate(CustomBigPredicateValidator, ["gt", 0], {
    message: "Wager must be greater than 0",
  })
  wager: string;

  @IsArray()
  @ArrayUnique()
  @ArrayMinSize(Keno.minPredictionTiles)
  @ArrayMaxSize(Keno.maxPredictionTiles)
  @IsInt({ each: true })
  @Min(Keno.minBet, { each: true })
  @Max(Keno.maxBet, { each: true })
  prediction: number[];

  @IsBoolean()
  auto: boolean;

  @IsEnum(KenoRisk)
  risk: KenoRisk;
}
