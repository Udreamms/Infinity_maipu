import "./env.js";
import { COLLECTIONS, getDb } from "./index.js";

const courts = [
  { id: "cancha-7-a", name: "Cancha 1 · Fútbol 7", type: "FUTBOL_7" },
  { id: "cancha-7-b", name: "Cancha 2 · Fútbol 7", type: "FUTBOL_7" },
  { id: "cancha-9-a", name: "Cancha 3 · Fútbol 9", type: "FUTBOL_9" },
];

const db = getDb();
const batch = db.batch();
for (const { id, ...data } of courts) batch.set(db.collection(COLLECTIONS.courts).doc(id), data);
await batch.commit();
console.log(`Sembradas ${courts.length} canchas`);
