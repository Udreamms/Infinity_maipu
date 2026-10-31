import { courtsRepo, reservationsRepo } from "@infinity/database";
import {
  addHours,
  calculatePrice,
  isSlotAvailable,
  type CreateReservationInput,
} from "@infinity/functions";

export class SlotUnavailableError extends Error {}
export class CourtNotFoundError extends Error {}

export async function createReservation(input: CreateReservationInput) {
  const court = await courtsRepo.get(input.courtId);
  if (!court) throw new CourtNotFoundError();

  const slot = { startsAt: input.startsAt, endsAt: addHours(input.startsAt, input.hours) };
  const booked = await reservationsRepo.listOverlapping(court.id, slot.startsAt, slot.endsAt);
  if (!isSlotAvailable(slot, booked)) throw new SlotUnavailableError();

  return reservationsRepo.create({
    courtId: court.id,
    name: input.name,
    phone: input.phone,
    ...slot,
    priceClp: calculatePrice(court.type, input.hours),
  });
}
