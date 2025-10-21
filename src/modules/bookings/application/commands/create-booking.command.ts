export class CreateBookingCommand {
  constructor(
    public readonly userId: string,
    public readonly resourceId: string,
    public readonly start: Date,
    public readonly end: Date,
  ) {}
}
