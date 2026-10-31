"use client";

import { useEffect } from "react";
import { initLanding } from "@/features/landing/legacy-app";

/** Monta la experiencia interactiva (3D, reserva, overlays) una vez hidratada la página. */
export function LandingRuntime() {
  useEffect(() => {
    initLanding();
  }, []);
  return null;
}
