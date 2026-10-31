const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface Court {
  id: string;
  name: string;
  type: "FUTBOL_7" | "FUTBOL_9";
}

export async function getCourts(): Promise<Court[]> {
  const res = await fetch(`${API_URL}/courts`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudieron cargar las canchas");
  return res.json();
}
