import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Inicializa Firebase Admin con las credenciales de las variables de entorno
 * (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).
 * Si FIRESTORE_EMULATOR_HOST está definido, no se necesitan credenciales reales.
 */
function getApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (process.env.FIRESTORE_EMULATOR_HOST) return initializeApp({ projectId: projectId ?? "demo-infinity" });

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Faltan credenciales de Firebase: revisa FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function getDb(): Firestore {
  return getFirestore(getApp());
}
