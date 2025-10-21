import { BookingPolicy } from 'src/modules/bookings/domain/booking-policy';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { Booking } from 'src/modules/bookings/domain/booking';
import { BookingStatus } from 'src/modules/bookings/domain/booking-status';

export class BookingScheduler {
  constructor(private readonly bookings: BookingRepository) {}

  async schedule(
    userId: string,
    resourceId: string,
    start: Date,
    end: Date,
  ): Promise<Booking> {
    BookingPolicy.assertStartOnOrAfterNow(start);
    BookingPolicy.assertEndAfterStart(start, end);
    const exists = await this.bookings.existsOverlap(resourceId, start, end);
    if (exists) {
      throw new Error('overlapping booking');
    }
    return new Booking(
      '',
      userId,
      resourceId,
      start,
      end,
      BookingStatus.PENDING,
    );
  }
}
