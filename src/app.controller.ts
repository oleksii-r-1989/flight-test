import { Controller, Get, Query } from '@nestjs/common';
import { FlightSearchQueryDto } from './dto/flight-search-query.dto';
import { FlightDto } from './dto/flight.dto';
import { FlightService } from './flight.service';

@Controller()
export class AppController {
  constructor(private readonly flightService: FlightService) {}

  @Get()
  async searchForAFlight(
    @Query() filters: FlightSearchQueryDto,
  ): Promise<FlightDto[]> {
    return this.flightService.getFlightsByFilters(filters);
  }
}
