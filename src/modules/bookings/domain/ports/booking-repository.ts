import { Booking } from 'src/modules/bookings/domain/booking';
import { BookingStatus } from 'src/modules/bookings/domain/booking-status';

export interface BookingRepository {
  create(
    booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByUser(userId: string): Promise<Booking[]>;
  findByResource(resourceId: string): Promise<Booking[]>;
  list(filters: { userId?: string; resourceId?: string }): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus): Promise<Booking>;
  existsOverlap(resourceId: string, start: Date, end: Date): Promise<boolean>;
}
