import { z } from "zod";

export const courtTypeSchema = z.enum(["FUTBOL_7", "FUTBOL_9"]);
export type CourtType = z.infer<typeof courtTypeSchema>;

export const createReservationSchema = z.object({
  courtId: z.string().min(1),
  name: z.string().min(2).max(80),
  phone: z.string().min(8).max(20),
  startsAt: z.coerce.date(),
  hours: z.number().int().min(1).max(3).default(1),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
