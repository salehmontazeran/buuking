import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { Booking } from 'src/modules/bookings/domain/booking';
import { BookingStatus } from 'src/modules/bookings/domain/booking-status';
import type { $Enums, Booking as PrismaBooking } from '@prisma/client';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        userId: booking.userId,
        resourceId: booking.resourceId,
        start: booking.start,
        end: booking.end,
        status: booking.status as $Enums.BookingStatus,
      },
    });
    return this.map(created);
  }

  async findById(id: string): Promise<Booking | null> {
    const b = await this.prisma.booking.findUnique({ where: { id } });
    return b ? this.map(b) : null;
  }

  async findByUser(userId: string): Promise<Booking[]> {
    const list = await this.prisma.booking.findMany({ where: { userId } });
    return list.map(this.map);
  }

  async findByResource(resourceId: string): Promise<Booking[]> {
    const list = await this.prisma.booking.findMany({ where: { resourceId } });
    return list.map(this.map);
  }

  async list(filters: {
    userId?: string;
    resourceId?: string;
  }): Promise<Booking[]> {
    const list = await this.prisma.booking.findMany({ where: { ...filters } });
    return list.map(this.map);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: status as $Enums.BookingStatus },
    });
    return this.map(updated);
  }

  async existsOverlap(
    resourceId: string,
    start: Date,
    end: Date,
  ): Promise<boolean> {
    const found = await this.prisma.booking.findFirst({
      where: {
        resourceId,
        status: {
          in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
          ] as $Enums.BookingStatus[],
        },
        start: { lt: end },
        end: { gt: start },
      },
      select: { id: true },
    });
    return !!found;
  }

  private map = (b: PrismaBooking): Booking =>
    new Booking(
      b.id,
      b.userId,
      b.resourceId,
      new Date(b.start),
      new Date(b.end),
      b.status as BookingStatus,
      b.createdAt,
      b.updatedAt,
    );
}
