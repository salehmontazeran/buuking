import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBookingByIdQuery } from 'src/modules/bookings/application/queries/get-booking-by-id.query';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { BOOKING_REPOSITORY } from 'src/modules/bookings/tokens';
import type { Booking } from 'src/modules/bookings/domain/booking';

@Injectable()
@QueryHandler(GetBookingByIdQuery)
export class GetBookingByIdHandler
  implements IQueryHandler<GetBookingByIdQuery, Booking>
{
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: BookingRepository,
  ) {}

  async execute(query: GetBookingByIdQuery): Promise<Booking> {
    const b = await this.repo.findById(query.id);
    if (!b) throw new NotFoundException('booking not found');
    return b;
  }
}
