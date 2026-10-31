import type { CourtType } from "@infinity/functions";

export interface Court {
  id: string;
  name: string;
  type: CourtType;
}

export interface Reservation {
  id: string;
  courtId: string;
  name: string;
  phone: string;
  startsAt: Date;
  endsAt: Date;
  priceClp: number;
  createdAt: Date;
}
