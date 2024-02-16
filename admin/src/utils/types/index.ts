import type { Event as EventType } from "@prisma/client";

export type ParsedEventType = Omit<EventType, "event_date"> & {
  event_date: string;
};
