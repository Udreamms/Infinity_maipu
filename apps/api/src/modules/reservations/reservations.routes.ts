import type { FastifyPluginAsync } from "fastify";
import { createReservationSchema } from "@infinity/functions";
import {
  CourtNotFoundError,
  SlotUnavailableError,
  createReservation,
} from "./reservations.service.js";

export const reservationRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", async (request, reply) => {
    const parsed = createReservationSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ errors: parsed.error.flatten() });

    try {
      return reply.code(201).send(await createReservation(parsed.data));
    } catch (err) {
      if (err instanceof CourtNotFoundError) return reply.code(404).send({ error: "Cancha no encontrada" });
      if (err instanceof SlotUnavailableError) return reply.code(409).send({ error: "Horario no disponible" });
      throw err;
    }
  });
};
