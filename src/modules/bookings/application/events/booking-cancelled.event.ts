export class BookingCancelledEvent {
  constructor(
    public readonly bookingId: string,
    public readonly payload: Record<string, unknown>,
  ) {}
}
