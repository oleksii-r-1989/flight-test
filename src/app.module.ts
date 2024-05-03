import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightService } from './flight.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FlightService],
})
export class AppModule {}
