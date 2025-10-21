export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly payload: Record<string, unknown>,
  ) {}
}
