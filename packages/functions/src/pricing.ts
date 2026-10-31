import type { CourtType } from "./schemas.js";

/** Precio por hora en pesos chilenos (CLP). */
const HOURLY_PRICE_CLP: Record<CourtType, number> = {
  FUTBOL_7: 28000,
  FUTBOL_9: 40000,
};

export function calculatePrice(type: CourtType, hours: number): number {
  if (!Number.isInteger(hours) || hours < 1) {
    throw new RangeError("hours debe ser un entero mayor o igual a 1");
  }
  return HOURLY_PRICE_CLP[type] * hours;
}
