import type { FastifyPluginAsync } from "fastify";
import { courtsRepo } from "@infinity/database";

export const courtRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => courtsRepo.list());
};
