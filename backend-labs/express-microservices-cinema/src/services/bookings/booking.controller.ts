// given — HTTP in, HTTP out. Builds the RequestContext every service call
// needs from the headers the gateway set, then calls one service method.

import { randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { requireUserId } from "../../lib/user";
import { RequestContext } from "./clients/http";
import { bookingService } from "./booking.service";
import { createBookingBodySchema } from "./booking.validation";

function contextOf(req: Request): RequestContext {
  return { userId: requireUserId(req), requestId: req.header("x-request-id") ?? randomUUID() };
}

export const bookingController = {
  async create(req: Request, res: Response) {
    const context = contextOf(req);
    const body = createBookingBodySchema.parse(req.body);
    res.status(201).json(await bookingService.createBooking(context, body));
  },

  async list(req: Request, res: Response) {
    res.json(await bookingService.listBookings(contextOf(req)));
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    res.json(await bookingService.getBooking(contextOf(req), Number(req.params.id)));
  },

  async cancel(req: Request<{ id: string }>, res: Response) {
    res.json(await bookingService.cancelBooking(contextOf(req), Number(req.params.id)));
  },
};
