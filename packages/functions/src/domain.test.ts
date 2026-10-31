import { describe, expect, it } from "vitest";
import { addHours, calculatePrice, isSlotAvailable } from "./index.js";

describe("calculatePrice", () => {
  it("multiplica la tarifa por las horas", () => {
    expect(calculatePrice("FUTBOL_7", 2)).toBe(56000);
  });
  it("rechaza horas inválidas", () => {
    expect(() => calculatePrice("FUTBOL_9", 0)).toThrow(RangeError);
  });
});

describe("isSlotAvailable", () => {
  const base = new Date("2026-11-01T20:00:00Z");
  const booked = [{ startsAt: base, endsAt: addHours(base, 1) }];

  it("detecta solapamiento", () => {
    expect(isSlotAvailable({ startsAt: addHours(base, 0.5), endsAt: addHours(base, 1.5) }, booked)).toBe(false);
  });
  it("permite un horario contiguo", () => {
    expect(isSlotAvailable({ startsAt: addHours(base, 1), endsAt: addHours(base, 2) }, booked)).toBe(true);
  });
});
