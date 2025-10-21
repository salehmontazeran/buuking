export class BookingConfirmedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly payload: Record<string, unknown>,
  ) {}
}
