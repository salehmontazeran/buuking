import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListBookingsQuery } from 'src/modules/bookings/application/queries/list-bookings.query';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { BOOKING_REPOSITORY } from 'src/modules/bookings/tokens';
import type { Booking } from 'src/modules/bookings/domain/booking';

@Injectable()
@QueryHandler(ListBookingsQuery)
export class ListBookingsHandler
  implements IQueryHandler<ListBookingsQuery, Booking[]>
{
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: BookingRepository,
  ) {}

  async execute(query: ListBookingsQuery): Promise<Booking[]> {
    return this.repo.list(query.filters);
  }
}
