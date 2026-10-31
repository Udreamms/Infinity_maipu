import { config } from "dotenv";
import { fileURLToPath } from "node:url";

/** Carga `.env.local` y `.env` de la raíz del monorepo (no pisa variables ya definidas). */
const root = fileURLToPath(new URL("../../../", import.meta.url));
config({ path: [`${root}.env.local`, `${root}.env`], quiet: true });
