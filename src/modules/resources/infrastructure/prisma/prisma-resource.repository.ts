import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import type { ResourceRepository } from 'src/modules/resources/domain/ports/resource-repository';
import { BookingStatus } from 'src/modules/bookings/domain/booking-status';

@Injectable()
export class PrismaResourceRepository implements ResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAvailable(
    start: Date,
    end: Date,
  ): Promise<Array<{ id: string; name: string }>> {
    const resources = await this.prisma.resource.findMany({
      where: {
        NOT: {
          bookings: {
            some: {
              status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
              start: { lt: end },
              end: { gt: start },
            },
          },
        },
      },
      select: { id: true, name: true },
    });
    return resources;
  }
}
