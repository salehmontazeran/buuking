import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateBookingDto } from 'src/modules/bookings/api/dto/create-booking.dto';
import { CreateBookingCommand } from 'src/modules/bookings/application/commands/create-booking.command';
import { ConfirmBookingCommand } from 'src/modules/bookings/application/commands/confirm-booking.command';
import { CancelBookingCommand } from 'src/modules/bookings/application/commands/cancel-booking.command';
import { GetBookingByIdQuery } from 'src/modules/bookings/application/queries/get-booking-by-id.query';
import { ListBookingsQuery } from 'src/modules/bookings/application/queries/list-bookings.query';
import type { Booking } from 'src/modules/bookings/domain/booking';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly commands: CommandBus,
    private readonly queries: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateBookingDto): Promise<Booking> {
    const start = new Date(dto.start);
    const end = new Date(dto.end);
    const booking = await this.commands.execute<CreateBookingCommand, Booking>(
      new CreateBookingCommand(dto.userId, dto.resourceId, start, end),
    );
    return booking;
  }

  @Post(':id/confirm')
  async confirm(@Param('id') id: string): Promise<Booking> {
    return this.commands.execute<ConfirmBookingCommand, Booking>(
      new ConfirmBookingCommand(id),
    );
  }

  @Delete(':id')
  async cancel(@Param('id') id: string): Promise<Booking> {
    return this.commands.execute<CancelBookingCommand, Booking>(
      new CancelBookingCommand(id),
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Booking> {
    return this.queries.execute<GetBookingByIdQuery, Booking>(
      new GetBookingByIdQuery(id),
    );
  }

  @Get()
  async list(
    @Query('userId') userId?: string,
    @Query('resourceId') resourceId?: string,
  ): Promise<Booking[]> {
    return this.queries.execute<ListBookingsQuery, Booking[]>(
      new ListBookingsQuery({ userId, resourceId }),
    );
  }
}
