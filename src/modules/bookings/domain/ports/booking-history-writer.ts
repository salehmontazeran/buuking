export interface BookingHistoryWriter {
  write(event: {
    bookingId: string;
    eventType: 'CREATED' | 'CONFIRMED' | 'CANCELLED';
    payload: Record<string, unknown>;
    occurredAt?: Date;
  }): Promise<void>;
}
