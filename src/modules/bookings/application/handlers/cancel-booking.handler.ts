import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CancelBookingCommand } from 'src/modules/bookings/application/commands/cancel-booking.command';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { BOOKING_REPOSITORY } from 'src/modules/bookings/tokens';
import type { Booking } from 'src/modules/bookings/domain/booking';
import { BookingCancelledEvent } from 'src/modules/bookings/application/events/booking-cancelled.event';

@Injectable()
@CommandHandler(CancelBookingCommand)
export class CancelBookingHandler
  implements ICommandHandler<CancelBookingCommand, Booking>
{
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: BookingRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: CancelBookingCommand): Promise<Booking> {
    const existing = await this.repo.findById(command.bookingId);
    if (!existing) throw new NotFoundException('booking not found');
    try {
      existing.cancel();
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
    const updated = await this.repo.updateStatus(existing.id, existing.status);
    await this.events.publish(
      new BookingCancelledEvent(updated.id, { status: updated.status }),
    );
    return updated;
  }
}
