// YOUR TASK (start here — exercise 1). Everything here is business logic:
// deciding whether a registration is *allowed*, not just writing a row.
// Repositories only answer questions ("does this exist?", "how many are
// there?") — deciding what those answers *mean* is your job.
//
// You have three repositories available, all given, all already correct:
//   - registrationsRepository (this resource's own — see repository.ts)
//   - workshopsRepository     (../workshops/repository.ts)
//   - attendeesRepository     (../attendees/repository.ts)
//
// Throw NotFoundError / ConflictError from "../lib/errors" — the
// controller's catch block (copy the pattern from workshops/controller.ts)
// turns those into 404 / 409 responses for you. Don't write status codes
// or res.json(...) anywhere in this file — that's the controller's job.

import { ConflictError, NotFoundError } from "../lib/errors";
import { attendeesRepository } from "../attendees/repository";
import { workshopsRepository } from "../workshops/repository";
import { registrationsRepository, type Registration } from "./repository";
import type { CreateRegistrationBody } from "./validation";

export const registrationsService = {
  async list(filters: { workshopId?: number }): Promise<Registration[]> {
    // TODO: just pass this through to the repository — no rules needed
    // for a plain list.
    return registrationsRepository.list(filters);
  },

  async getById(id: number): Promise<Registration> {
    // TODO: find it; if it doesn't exist, throw
    // `new NotFoundError(...)`.
    const row = await registrationsRepository.findById(id);
    if (!row) throw new NotFoundError(`registration row ${id} not found`);
    return row;
  },

  async create(data: CreateRegistrationBody): Promise<Registration> {
    // TODO, in order:
    //   1. Look up the workshop (workshopsRepository.findById). Doesn't
    //      exist? throw NotFoundError.
    //   2. Look up the attendee (attendeesRepository.findById). Doesn't
    //      exist? throw NotFoundError.
    //   3. Check for an existing CONFIRMED registration for this same
    //      workshop + attendee pair
    //      (registrationsRepository.findConfirmedByWorkshopAndAttendee).
    //      Found one? throw ConflictError — already registered.
    //   4. Check capacity: count confirmed registrations for this workshop
    //      (registrationsRepository.countConfirmedForWorkshop) and compare
    //      against workshop.capacity. At or over? throw ConflictError —
    //      workshop is full.
    //   5. All good — registrationsRepository.create(data) and return it.
    const workshop = await workshopsRepository.findById(data.workshopId);
    if (!workshop) {
      throw new NotFoundError(`workshop ${data.workshopId} not found`);
    }

    const attendee = await attendeesRepository.findById(data.attendeeId);
    if (!attendee) {
      throw new NotFoundError(`attendee ${data.attendeeId} not found`);
    }

    const existing =
      await registrationsRepository.findConfirmedByWorkshopAndAttendee(
        data.workshopId,
        data.attendeeId,
      );
    if (existing) {
      throw new ConflictError(
        `${data.attendeeId} is already signed with the workshop ${data.workshopId}`,
      );
    }

    const capacityCount =
      await registrationsRepository.countConfirmedForWorkshop(data.workshopId);

    if (capacityCount >= workshop.capacity) {
      throw new ConflictError("The workshop is full");
    }

    return registrationsRepository.create(data);
  },

  async cancel(id: number): Promise<Registration> {
    // TODO, in order:
    //   1. Find the registration by id. Doesn't exist? throw NotFoundError.
    //   2. Already "cancelled"? throw ConflictError — can't cancel twice.
    //   3. Otherwise, registrationsRepository.updateStatus(id, "cancelled")
    //      and return it.
    // throw new Error("not implemented");

    const row = await registrationsRepository.findById(id);
    if (!row) throw new NotFoundError(`registration row ${id} not found`);
    console.log("!!!!!row:", row);

    if (row.status === 'cancelled') {
      throw new ConflictError(
        `The register has been cancelled with ${id}`,
      );
    }

    return registrationsRepository.updateStatus(id, "cancelled");
  },
};
