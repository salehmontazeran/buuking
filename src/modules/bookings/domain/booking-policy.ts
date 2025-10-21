export class BookingPolicy {
  static assertEndAfterStart(start: Date, end: Date) {
    if (!(end.getTime() > start.getTime())) {
      throw new Error('End must be after start');
    }
  }

  static assertStartOnOrAfterNow(start: Date, now: Date = new Date()) {
    if (start.getTime() < now.getTime()) {
      throw new Error('Start must not be in the past');
    }
  }
}
