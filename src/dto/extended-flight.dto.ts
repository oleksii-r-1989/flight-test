import { FlightDto } from './flight.dto';

export class ExtendedFlightDto extends FlightDto {
  duration: number;

  distance: number;
}
