import type { Court } from "@/lib/api";

export function CourtList({ courts }: { courts: Court[] }) {
  if (courts.length === 0) return <p>No hay canchas disponibles por ahora.</p>;

  return (
    <ul>
      {courts.map((court) => (
        <li key={court.id}>{court.name}</li>
      ))}
    </ul>
  );
}
