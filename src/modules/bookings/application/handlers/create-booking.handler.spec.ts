import { ConflictException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { CreateBookingHandler } from 'src/modules/bookings/application/handlers/create-booking.handler';
import { CreateBookingCommand } from 'src/modules/bookings/application/commands/create-booking.command';
import type { BookingRepository } from 'src/modules/bookings/domain/ports/booking-repository';
import { Booking } from 'src/modules/bookings/domain/booking';
import { BookingStatus } from 'src/modules/bookings/domain/booking-status';
import type { PrismaUnitOfWork } from 'src/infra/prisma/prisma-uow';
import { BookingCreatedEvent } from 'src/modules/bookings/application/events/booking-created.event';

describe('CreateBookingHandler', () => {
  const makeUow = (repo: BookingRepository): PrismaUnitOfWork =>
    ({
      withTransaction: <T>(
        fn: (deps: { bookings: BookingRepository }) => Promise<T>,
      ): Promise<T> => fn({ bookings: repo }),
    }) as unknown as PrismaUnitOfWork;

  it('throws ConflictException on overlap', async () => {
    const repo: BookingRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      findByResource: jest.fn(),
      list: jest.fn(),
      updateStatus: jest.fn(),
      existsOverlap: jest.fn().mockResolvedValue(true),
    };
    const publish = jest.fn().mockResolvedValue(undefined);
    const events = { publish } as unknown as EventBus;
    const handler = new CreateBookingHandler(repo, events, makeUow(repo));
    await expect(
      handler.execute(
        new CreateBookingCommand(
          'u',
          'r',
          new Date('2030-01-01T10:00:00Z'),
          new Date('2030-01-01T11:00:00Z'),
        ),
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates booking and publishes event when no overlap', async () => {
    const repo: BookingRepository = {
      create: jest
        .fn()
        .mockImplementation(
          (
            b: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>,
          ): Promise<Booking> =>
            Promise.resolve(
              new Booking(
                'id1',
                b.userId,
                b.resourceId,
                b.start,
                b.end,
                BookingStatus.PENDING,
              ),
            ),
        ),
      findById: jest.fn(),
      findByUser: jest.fn(),
      findByResource: jest.fn(),
      list: jest.fn(),
      updateStatus: jest.fn(),
      existsOverlap: jest.fn().mockResolvedValue(false),
    };
    const publish = jest.fn().mockResolvedValue(undefined);
    const events = { publish } as unknown as EventBus;
    const handler = new CreateBookingHandler(repo, events, makeUow(repo));
    const created = await handler.execute(
      new CreateBookingCommand(
        'u',
        'r',
        new Date('2030-01-01T10:00:00Z'),
        new Date('2030-01-01T11:00:00Z'),
      ),
    );
    expect(created.id).toBe('id1');
    expect(publish).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledWith(expect.any(BookingCreatedEvent));
    expect(publish).toHaveBeenCalledWith(
      expect.objectContaining({ bookingId: 'id1' }),
    );
  });
});
