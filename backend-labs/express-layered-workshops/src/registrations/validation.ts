// YOUR TASK — replace each placeholder schema below with a real one.
// Follow the shape of workshops/validation.ts. The placeholders are only
// here so the rest of the project compiles before you've started; every
// endpoint that uses one will accept requests it shouldn't until you fix it
// (that's expected, and the tests will catch it).

import { z } from "zod";

// TODO: one field, `id`, coerced to a number, must be an integer.
// (copy workshopIdParamSchema's shape exactly)
export const registrationIdParamSchema = z.object({
  id: z.coerce.number().int(),
});

// TODO: one OPTIONAL field, `workshopId`, coerced to a number, integer.
// used for GET /registrations?workshopId=3 to filter to one workshop.
export const listRegistrationsQuerySchema = z.object({
  workshopId: z.coerce.number().int(),
});

// TODO: two required integer fields: `workshopId`, `attendeeId`.
export const createRegistrationBodySchema = z.object({
  workshopId: z.coerce.number().int(),
  attendeeId: z.coerce.number().int(),
});
export type CreateRegistrationBody = z.infer<typeof createRegistrationBodySchema>;

// TODO: one field, `status`, which for this lab only ever accepts the
// exact string "cancelled" — there's no other transition PATCH supports
// here (look up z.literal()).
export const cancelRegistrationBodySchema = z.object({
  status: z.literal("cancelled"),
});
