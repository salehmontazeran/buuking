import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { BookingHistoryWriter } from 'src/modules/bookings/domain/ports/booking-history-writer';
import { BookingEventType, Prisma } from '@prisma/client';

@Injectable()
export class PrismaBookingHistoryWriter implements BookingHistoryWriter {
  constructor(private readonly prisma: PrismaService) {}

  async write(event: {
    bookingId: string;
    eventType: 'CREATED' | 'CONFIRMED' | 'CANCELLED';
    payload: Record<string, unknown>;
    occurredAt?: Date;
  }): Promise<void> {
    const payload = event.payload as Prisma.InputJsonValue;
    await this.prisma.bookingHistory.create({
      data: {
        bookingId: event.bookingId,
        eventType: event.eventType as BookingEventType,
        payload: payload,
        createdAt: event.occurredAt ?? new Date(),
      },
    });
  }
}
