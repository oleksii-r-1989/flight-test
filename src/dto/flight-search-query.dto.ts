import {
  IsDate,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
} from 'class-validator';
import { Carrier, HOURS_IN_DAY } from '../constants';
import { Type } from 'class-transformer';

export class FlightSearchQueryDto {
  @IsDateString()
  @IsNotEmpty()
  departureMinDate: string;

  @IsDateString()
  @IsNotEmpty()
  departureMaxDate: string;

  @Max(HOURS_IN_DAY)
  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  duration: number;

  @IsEnum(Carrier)
  @IsNotEmpty()
  carrier: Carrier;
}
