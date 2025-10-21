export class ListBookingsQuery {
  constructor(
    public readonly filters: { userId?: string; resourceId?: string } = {},
  ) {}
}
