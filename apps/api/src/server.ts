import { buildApp } from "./app.js";
import { config } from "./config.js";

buildApp()
  .listen({ port: config.port, host: "0.0.0.0" })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
