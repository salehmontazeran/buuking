import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BookingCreatedEvent } from 'src/modules/bookings/application/events/booking-created.event';
import { BookingConfirmedEvent } from 'src/modules/bookings/application/events/booking-confirmed.event';
import { BookingCancelledEvent } from 'src/modules/bookings/application/events/booking-cancelled.event';
import type { BookingHistoryWriter } from 'src/modules/bookings/domain/ports/booking-history-writer';
import { Inject } from '@nestjs/common';
import { BOOKING_HISTORY_WRITER } from 'src/modules/bookings/tokens';

@EventsHandler(
  BookingCreatedEvent,
  BookingConfirmedEvent,
  BookingCancelledEvent,
)
export class BookingHistoryHandler
  implements
    IEventHandler<
      BookingCreatedEvent | BookingConfirmedEvent | BookingCancelledEvent
    >
{
  constructor(
    @Inject(BOOKING_HISTORY_WRITER)
    private readonly history: BookingHistoryWriter,
  ) {}

  async handle(
    event: BookingCreatedEvent | BookingConfirmedEvent | BookingCancelledEvent,
  ) {
    if (event instanceof BookingCreatedEvent) {
      await this.history.write({
        bookingId: event.bookingId,
        eventType: 'CREATED',
        payload: event.payload,
      });
      return;
    }
    if (event instanceof BookingConfirmedEvent) {
      await this.history.write({
        bookingId: event.bookingId,
        eventType: 'CONFIRMED',
        payload: event.payload,
      });
      return;
    }
    if (event instanceof BookingCancelledEvent) {
      await this.history.write({
        bookingId: event.bookingId,
        eventType: 'CANCELLED',
        payload: event.payload,
      });
    }
  }
}
