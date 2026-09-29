import { pool } from "../../db";

export type Notification = { id: number; type: string; message: string; createdAt: string };

export const notificationRepository = {
  async create(userId: number, type: string, message: string): Promise<void> {
    await pool.query("INSERT INTO notifications (user_id, type, message) VALUES ($1, $2, $3)", [
      userId,
      type,
      message,
    ]);
  },

  async findByUser(userId: number): Promise<Notification[]> {
    const { rows } = await pool.query<Notification>(
      'SELECT id, type, message, created_at AS "createdAt" FROM notifications WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    return rows;
  },
};
