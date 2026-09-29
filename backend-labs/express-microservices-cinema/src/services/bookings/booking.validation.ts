// given

import { z } from "zod";

export const createBookingBodySchema = z.object({
  showtimeId: z.number().int().positive(),
  seats: z.array(z.string()).min(1).max(8),
});

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
