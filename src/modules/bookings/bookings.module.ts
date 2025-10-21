import { Module, type Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingsController } from 'src/modules/bookings/api/bookings.controller';
import { PrismaBookingRepository } from 'src/modules/bookings/infrastructure/prisma/prisma-booking.repository';
import { CreateBookingHandler } from 'src/modules/bookings/application/handlers/create-booking.handler';
import { ConfirmBookingHandler } from 'src/modules/bookings/application/handlers/confirm-booking.handler';
import { CancelBookingHandler } from 'src/modules/bookings/application/handlers/cancel-booking.handler';
import { GetBookingByIdHandler } from 'src/modules/bookings/application/handlers/get-booking-by-id.handler';
import { ListBookingsHandler } from 'src/modules/bookings/application/handlers/list-bookings.handler';
import { BookingHistoryHandler } from 'src/modules/bookings/application/events/handlers/booking-history.handler';
import { PrismaBookingHistoryWriter } from 'src/modules/bookings/infrastructure/prisma/prisma-booking-history.writer';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import {
  BOOKING_HISTORY_WRITER,
  BOOKING_REPOSITORY,
} from 'src/modules/bookings/tokens';
import { PrismaUnitOfWork } from 'src/infra/prisma/prisma-uow';

const commandHandlers: Provider[] = [
  CreateBookingHandler,
  ConfirmBookingHandler,
  CancelBookingHandler,
];
const queryHandlers: Provider[] = [GetBookingByIdHandler, ListBookingsHandler];
const eventHandlers: Provider[] = [BookingHistoryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [BookingsController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    PrismaService,
    PrismaUnitOfWork,
    { provide: BOOKING_REPOSITORY, useClass: PrismaBookingRepository },
    { provide: BOOKING_HISTORY_WRITER, useClass: PrismaBookingHistoryWriter },
  ],
})
export class BookingsModule {}
