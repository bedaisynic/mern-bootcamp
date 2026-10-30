import { db } from '../../db/index.js';
import { tickets, users } from '../../db/schema.js';
import { eq, and, or, like, desc, asc, sql, count } from 'drizzle-orm';
import { TicketFilters, CreateTicketDto, UpdateTicketDto } from './ticket.types.js';

export const findAll = async (filters: TicketFilters) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    priority,
    category,
    assigneeId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const offset = (page - 1) * limit;
  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(tickets.title, `%${search}%`),
        like(tickets.description, `%${search}%`)
      )
    );
  }

  if (status) {
    conditions.push(eq(tickets.status, status));
  }

  if (priority) {
    conditions.push(eq(tickets.priority, priority));
  }

  if (category) {
    conditions.push(eq(tickets.category, category));
  }

  if (assigneeId !== undefined) {
    conditions.push(eq(tickets.assigneeId, assigneeId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByColumn = tickets[sortBy];
  const orderFn = sortOrder === 'asc' ? asc : desc;

  const [results, totalCount] = await Promise.all([
    db
      .select()
      .from(tickets)
      .where(whereClause)
      .orderBy(orderFn(orderByColumn))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(tickets)
      .where(whereClause)
      .then(res => res[0].count),
  ]);

  return { results, totalCount };
};

export const findById = async (id: number) => {
  const result = await db
    .select({
      ticket: tickets,
      assignee: users,
    })
    .from(tickets)
    .leftJoin(users, eq(tickets.assigneeId, users.id))
    .where(eq(tickets.id, id))
    .limit(1);

  if (!result[0]) return null;

  const { ticket, assignee } = result[0];
  return {
    ...ticket,
    assignee: assignee || undefined,
  };
};

export const create = async (data: CreateTicketDto & { slaDeadline: Date }) => {
  const [ticket] = await db
    .insert(tickets)
    .values({
      ...data,
      status: 'open',
      updatedAt: new Date(),
    })
    .returning();

  return ticket;
};

export const update = async (id: number, data: UpdateTicketDto) => {
  const [ticket] = await db
    .update(tickets)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, id))
    .returning();

  return ticket;
};

export const updateStatus = async (id: number, status: string, timestamps: { resolvedAt?: Date; closedAt?: Date }) => {
  const [ticket] = await db
    .update(tickets)
    .set({
      status,
      ...timestamps,
      updatedAt: new Date(),
    })
    .where(eq(tickets.id, id))
    .returning();

  return ticket;
};

export const deleteById = async (id: number) => {
  await db.delete(tickets).where(eq(tickets.id, id));
};

export const exists = async (id: number): Promise<boolean> => {
  const result = await db
    .select({ id: tickets.id })
    .from(tickets)
    .where(eq(tickets.id, id))
    .limit(1);

  return result.length > 0;
};
