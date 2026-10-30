import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const findAll = async () => {
  return await db.select().from(users);
};

export const findById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user || null;
};

export const findByUsername = async (username: string) => {
  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return user || null;
};
