import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateBookingCommand } from 'src/modules/bookings/application/commands/create-booking.command';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { BOOKING_REPOSITORY } from 'src/modules/bookings/tokens';
import type { Booking as BookingType } from 'src/modules/bookings/domain/booking';
import { PrismaUnitOfWork } from 'src/infra/prisma/prisma-uow';
import { BookingScheduler } from 'src/modules/bookings/domain/services/booking-scheduler';
import { BookingCreatedEvent } from 'src/modules/bookings/application/events/booking-created.event';

@Injectable()
@CommandHandler(CreateBookingCommand)
export class CreateBookingHandler
  implements ICommandHandler<CreateBookingCommand, BookingType>
{
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: BookingRepository,
    private readonly events: EventBus,
    private readonly uow: PrismaUnitOfWork,
  ) {}

  async execute(command: CreateBookingCommand): Promise<BookingType> {
    const created = await this.uow.withTransaction(async ({ bookings }) => {
      let entity: BookingType;
      try {
        const scheduler = new BookingScheduler(bookings);
        entity = await scheduler.schedule(
          command.userId,
          command.resourceId,
          command.start,
          command.end,
        );
      } catch (e) {
        const msg = (e as Error)?.message ?? '';
        if (typeof msg === 'string' && msg.includes('overlapping booking')) {
          throw new ConflictException('overlapping booking');
        }
        throw new BadRequestException(msg);
      }
      const created = await bookings.create(entity);
      return created;
    });
    await this.events.publish(
      new BookingCreatedEvent(created.id, {
        status: created.status,
        start: created.start.toISOString(),
        end: created.end.toISOString(),
        userId: created.userId,
        resourceId: created.resourceId,
      }),
    );
    return created;
  }
}
