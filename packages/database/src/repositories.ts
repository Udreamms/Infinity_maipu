import { Timestamp, type DocumentData } from "firebase-admin/firestore";
import { COLLECTIONS } from "./collections.js";
import { getDb } from "./firebase.js";
import type { Court, Reservation } from "./models.js";

export const courtsRepo = {
  async list(): Promise<Court[]> {
    const snap = await getDb().collection(COLLECTIONS.courts).orderBy("name").get();
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Court, "id">) }));
  },

  async get(id: string): Promise<Court | null> {
    const doc = await getDb().collection(COLLECTIONS.courts).doc(id).get();
    return doc.exists ? { id: doc.id, ...(doc.data() as Omit<Court, "id">) } : null;
  },
};

type NewReservation = Omit<Reservation, "id" | "createdAt">;

function toReservation(id: string, data: DocumentData): Reservation {
  return {
    id,
    courtId: data.courtId,
    name: data.name,
    phone: data.phone,
    priceClp: data.priceClp,
    startsAt: (data.startsAt as Timestamp).toDate(),
    endsAt: (data.endsAt as Timestamp).toDate(),
    createdAt: (data.createdAt as Timestamp).toDate(),
  };
}

export const reservationsRepo = {
  /** Reservas de una cancha que empiezan antes de `to` y terminan después de `from`. */
  async listOverlapping(courtId: string, from: Date, to: Date): Promise<Reservation[]> {
    const snap = await getDb()
      .collection(COLLECTIONS.reservations)
      .where("courtId", "==", courtId)
      .where("startsAt", "<", Timestamp.fromDate(to))
      .get();
    return snap.docs.map((d) => toReservation(d.id, d.data())).filter((r) => r.endsAt > from);
  },

  async create(data: NewReservation): Promise<Reservation> {
    const ref = getDb().collection(COLLECTIONS.reservations).doc();
    const createdAt = new Date();
    await ref.set({
      ...data,
      startsAt: Timestamp.fromDate(data.startsAt),
      endsAt: Timestamp.fromDate(data.endsAt),
      createdAt: Timestamp.fromDate(createdAt),
    });
    return { id: ref.id, ...data, createdAt };
  },
};
