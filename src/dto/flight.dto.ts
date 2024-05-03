import { Type } from 'class-transformer';
import { Carrier } from '../constants';

export class FlightDto {
  @Type(() => Date)
  departureTime: Date;

  @Type(() => Date)
  arrivalTime: Date;

  carrier: Carrier;
  origin: string;
  destination: string;
}
