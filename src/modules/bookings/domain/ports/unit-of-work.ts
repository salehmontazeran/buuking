import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';

export interface UnitOfWork {
  withTransaction<T>(
    fn: (deps: { bookings: BookingRepository }) => Promise<T>,
  ): Promise<T>;
}
