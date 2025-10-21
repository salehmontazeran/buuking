import { BookingPolicy } from './booking-policy';

describe('BookingPolicy', () => {
  it('end must be after start', () => {
    const start = new Date('2025-01-01T10:00:00Z');
    const end = new Date('2025-01-01T11:00:00Z');
    expect(() => BookingPolicy.assertEndAfterStart(start, end)).not.toThrow();
    expect(() => BookingPolicy.assertEndAfterStart(end, start)).toThrow();
  });

  it('start must be on or after now (equal allowed)', () => {
    const now = new Date('2025-01-01T10:00:00Z');
    expect(() => BookingPolicy.assertStartOnOrAfterNow(now, now)).not.toThrow();
    expect(() =>
      BookingPolicy.assertStartOnOrAfterNow(
        new Date('2025-01-01T10:00:01Z'),
        now,
      ),
    ).not.toThrow();
  });

  it('start before now is rejected', () => {
    const now = new Date('2025-01-01T10:00:00Z');
    expect(() =>
      BookingPolicy.assertStartOnOrAfterNow(
        new Date('2025-01-01T09:59:59Z'),
        now,
      ),
    ).toThrow();
  });
});
