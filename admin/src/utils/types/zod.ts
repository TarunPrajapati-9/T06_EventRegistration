import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const EditEventSchema = z.object({
  id: z.string().min(4),
  event_name: z.string().min(3),
  canvas_image: z.string().url(),
  event_date: z.string().min(3),
  event_description: z.string().min(3),
  reg_fees: z.number(),
  event_capacity: z.number().max(10000),
  organizer_id: z.string(),
});

export const EditOrganizerSchema = z.object({
  id: z.string().min(4),
  o_name: z.string().min(3),
  o_email: z.string().email(),
});

export const AddOrganizerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(3),
});
