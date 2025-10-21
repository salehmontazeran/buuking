import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmBookingCommand } from 'src/modules/bookings/application/commands/confirm-booking.command';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { BOOKING_REPOSITORY } from 'src/modules/bookings/tokens';
import type { Booking } from 'src/modules/bookings/domain/booking';
import { BookingConfirmedEvent } from 'src/modules/bookings/application/events/booking-confirmed.event';

@Injectable()
@CommandHandler(ConfirmBookingCommand)
export class ConfirmBookingHandler
  implements ICommandHandler<ConfirmBookingCommand, Booking>
{
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly repo: BookingRepository,
    private readonly events: EventBus,
  ) {}

  async execute(command: ConfirmBookingCommand): Promise<Booking> {
    const existing = await this.repo.findById(command.bookingId);
    if (!existing) throw new NotFoundException('booking not found');
    try {
      existing.confirm();
    } catch (e) {
      throw new BadRequestException((e as Error).message);
    }
    const updated = await this.repo.updateStatus(existing.id, existing.status);
    await this.events.publish(
      new BookingConfirmedEvent(updated.id, { status: updated.status }),
    );
    return updated;
  }
}
