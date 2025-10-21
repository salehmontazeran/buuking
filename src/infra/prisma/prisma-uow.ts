import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import type { UnitOfWork } from 'src/modules/bookings/domain/ports/unit-of-work';
import { PrismaBookingRepository } from 'src/modules/bookings/infrastructure/prisma/prisma-booking.repository';

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async withTransaction<T>(
    fn: (deps: { bookings: PrismaBookingRepository }) => Promise<T>,
  ): Promise<T> {
    await this.prisma.$executeRawUnsafe('BEGIN IMMEDIATE');
    try {
      const bookings = new PrismaBookingRepository(this.prisma);
      const res = await fn({ bookings });
      await this.prisma.$executeRawUnsafe('COMMIT');
      return res;
    } catch (e) {
      try {
        await this.prisma.$executeRawUnsafe('ROLLBACK');
      } catch {
        // rollback already failed
      }
      throw e;
    }
  }
}
