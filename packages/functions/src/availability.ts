export interface TimeRange {
  startsAt: Date;
  endsAt: Date;
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3_600_000);
}

export function overlaps(a: TimeRange, b: TimeRange): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

export function isSlotAvailable(slot: TimeRange, booked: readonly TimeRange[]): boolean {
  return !booked.some((range) => overlaps(slot, range));
}
