import { BookingStatus } from 'src/modules/bookings/domain/booking-status';

export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly resourceId: string,
    public start: Date,
    public end: Date,
    public status: BookingStatus,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  confirm() {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only PENDING bookings can be confirmed');
    }
    this.status = BookingStatus.CONFIRMED;
  }

  cancel() {
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error('Booking already cancelled');
    }
    this.status = BookingStatus.CANCELLED;
  }
}
