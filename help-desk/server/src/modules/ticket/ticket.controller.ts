import { Request, Response, NextFunction } from "express";
import * as ticketService from "./ticket.service.js";
import { ValidationError, NotImplementedError } from "../../shared/errors.js";
import {
  TicketFilters,
  CreateTicketDto,
  UpdateTicketDto,
  STATUSES,
  PRIORITIES,
  CATEGORIES,
} from "./ticket.types.js";

// '/tickets/abc' -> 400, instead of querying the database with NaN
const parseId = (raw: string): number => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError("Ticket id must be a positive integer");
  }
  return id;
};

// Manual validation. For create every field is checked; for update (partial)
// a field is only checked if the client sent it.
// The two overloads tell TypeScript what comes back: create mode guarantees every
// required field (CreateTicketDto), update mode may return any subset (UpdateTicketDto).
function validateTicketBody(body: any, partial: false): CreateTicketDto;
function validateTicketBody(body: any, partial: true): UpdateTicketDto;
function validateTicketBody(
  body: any,
  partial: boolean,
): CreateTicketDto | UpdateTicketDto {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("Request body is required");
  }

  const check = (field: string) => !partial || body[field] !== undefined;

  if (
    check("title") &&
    (typeof body.title !== "string" || body.title.trim().length < 5)
  ) {
    throw new ValidationError("Title must be at least 5 characters");
  }
  if (
    check("description") &&
    (typeof body.description !== "string" || body.description.trim() === "")
  ) {
    throw new ValidationError("Description is required");
  }
  if (check("priority") && !PRIORITIES.includes(body.priority)) {
    throw new ValidationError(
      `Priority must be one of: ${PRIORITIES.join(", ")}`,
    );
  }
  if (check("category") && !CATEGORIES.includes(body.category)) {
    throw new ValidationError(
      `Category must be one of: ${CATEGORIES.join(", ")}`,
    );
  }
  if (
    check("reporterName") &&
    (typeof body.reporterName !== "string" || body.reporterName.trim() === "")
  ) {
    throw new ValidationError("Reporter name is required");
  }
  if (
    check("reporterEmail") &&
    (typeof body.reporterEmail !== "string" ||
      !/^\S+@\S+\.\S+$/.test(body.reporterEmail))
  ) {
    throw new ValidationError("Invalid email format");
  }
  if (
    body.assigneeId !== undefined &&
    body.assigneeId !== null &&
    !Number.isInteger(body.assigneeId)
  ) {
    throw new ValidationError("assigneeId must be a whole number or null");
  }

  // Copy only the known fields so unexpected keys never reach the database
  const input: UpdateTicketDto = {};
  const fields: (keyof UpdateTicketDto)[] = [
    "title",
    "description",
    "priority",
    "category",
    "reporterName",
    "reporterEmail",
    "assigneeId",
  ];
  for (const field of fields) {
    if (body[field] !== undefined) {
      (input as any)[field] = body[field];
    }
  }
  return input as CreateTicketDto | UpdateTicketDto;
}

export const getAllTickets = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filters: TicketFilters = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      status: req.query.status as any,
      priority: req.query.priority as any,
      category: req.query.category as any,
      assigneeId: req.query.assigneeId
        ? parseInt(req.query.assigneeId as string)
        : undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };

    const result = await ticketService.getAllTickets(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseId(req.params.id);
    const result = await ticketService.getTicketById(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Validate req.body with validateTicketBody (create mode), create the ticket using the service, return it with status 201

    const input = validateTicketBody(req.body, false);
    const ticket = await ticketService.createTicket(input);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Get the ticket ID from params with parseId, validate req.body with validateTicketBody (partial mode), update using the service, return the result
    const id = parseId(req.params.id);
    const input = validateTicketBody(req.body, true);

    const ticket = await ticketService.updateTicket(id, input);

    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Get the ticket ID from params with parseId, read `status` from req.body and make sure it is one of STATUSES (otherwise throw a ValidationError), update using the service, return the result

    const id = parseId(req.params.id);
    const input = req.body.status;

    if (
      input !== "open" &&
      input !== "in_progress" &&
      input !== "resolved" &&
      input !== "closed"
    ) {
      throw new ValidationError("Request body is invalid");
    }

    const status = await ticketService.updateTicketStatus(id, input);

    res.json(status);
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Get the ticket ID from params with parseId, delete using the service, return the result
    const id = parseId(req.params.id);
    await ticketService.deleteTicket(id);
    res.status(200).end();
  } catch (error) {
    next(error);
  }
};
