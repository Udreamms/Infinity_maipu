import cors from "@fastify/cors";
import Fastify from "fastify";
import { config } from "./config.js";
import { courtRoutes } from "./modules/courts/courts.routes.js";
import { reservationRoutes } from "./modules/reservations/reservations.routes.js";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: config.webOrigin });
  app.get("/health", async () => ({ status: "ok" }));
  app.register(courtRoutes, { prefix: "/courts" });
  app.register(reservationRoutes, { prefix: "/reservations" });
  return app;
}
