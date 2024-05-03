import { Injectable } from '@nestjs/common';
import axios, { Axios } from 'axios';
import {
  Carrier,
  DEFAULT_CARRIER_MULTIPLIER,
  FLIGHT_API_BASE_URL,
  FLIGHT_API_URL,
  MILLISECONDS_IN_HOUR,
  PREFERRED_CARRIER_MULTIPLIER,
} from './constants';
import { plainToInstance } from 'class-transformer';
import { FlightDto } from './dto/flight.dto';
import { FlightSearchQueryDto } from './dto/flight-search-query.dto';
import { ExtendedFlightDto } from './dto/extended-flight.dto';
import { FlightWithScoreDto } from './dto/flight-with-score.dto';

@Injectable()
export class FlightService {
  private apiClient: Axios;

  constructor() {
    this.apiClient = axios.create({
      method: 'get',
      baseURL: FLIGHT_API_BASE_URL,
      responseType: 'json',
    });
  }

  public async getFlightsByFilters(
    filters: FlightSearchQueryDto,
  ): Promise<ExtendedFlightDto[]> {
    const flights = await this.getAllFlights(filters);
    const validFlights = this.filterFlights(filters, flights);

    this.sortFlights(validFlights);

    return validFlights;
  }

  private filterFlights(
    filters: FlightSearchQueryDto,
    data: FlightWithScoreDto[],
  ): FlightWithScoreDto[] {
    return data
      .filter((flight: FlightDto): boolean => {
        const departureMinDate = new Date(filters.departureMinDate);

        return flight.departureTime.getTime() >= departureMinDate.getTime();
      })
      .filter((flight: FlightDto): boolean => {
        const departureMaxDate = new Date(filters.departureMaxDate);

        return flight.departureTime.getTime() <= departureMaxDate.getTime();
      })
      .filter(
        (flight: ExtendedFlightDto): boolean =>
          flight.duration <= filters.duration,
      );
  }

  private sortFlights(data: FlightWithScoreDto[]) {
    data.sort((a: FlightWithScoreDto, b: FlightWithScoreDto): number => {
      return a.score - b.score;
    });
  }

  private calculateFlightScore(
    flight: ExtendedFlightDto,
    preferredCarrier: Carrier,
  ) {
    const carrierMultiplier =
      flight.carrier == preferredCarrier
        ? PREFERRED_CARRIER_MULTIPLIER
        : DEFAULT_CARRIER_MULTIPLIER;

    return flight.duration * carrierMultiplier * flight.distance;
  }

  private async getAllFlights(
    filters: FlightSearchQueryDto,
  ): Promise<FlightWithScoreDto[]> {
    const response = await this.apiClient.get(FLIGHT_API_URL);
    const flights = plainToInstance(FlightDto, response.data as unknown[]);

    return Promise.all(
      flights.map(async (flight: FlightDto): Promise<FlightWithScoreDto> => {
        const duration = this.calculateDurationInHours(flight);
        const distance = await this.getDistanceBetweenAirports(
          flight.origin,
          flight.destination,
        );
        const data = {
          ...flight,
          duration,
          distance,
        };
        const score = this.calculateFlightScore(data, filters.carrier);

        return plainToInstance(FlightWithScoreDto, {
          ...data,
          score,
        });
      }),
    );
  }

  private calculateDurationInHours(flight: FlightDto): number {
    return (
      Math.abs(flight.arrivalTime.getTime() - flight.departureTime.getTime()) /
      MILLISECONDS_IN_HOUR
    );
  }

  private async getDistanceBetweenAirports(
    code1: string,
    code2: string,
  ): Promise<number> {
    return 100;
  }
}
