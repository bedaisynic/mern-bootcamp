import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { pool } from "../../db/pool";

// #demo-pagination (see DEMOS.md)
// same feed (activity_logs, 10M rows), same page size, two ways to get a
// page of it. each handler is self-contained — validation, SQL and response
// in one place — and the "---- x ----" comments mark which layer each part
// would normally live in. watch the timings in the terminal as you go deeper.
//
// both styles list the feed newest-first (ORDER BY id DESC). columns are
// aliased to camelCase for the API response.

type ActivityRow = {
  id: number;
  userId: number;
  action: string;
  createdAt: Date;
};

const COLUMNS = `id, user_id AS "userId", action, created_at AS "createdAt"`;

const limitSchema = z.coerce.number().int().positive().max(100).default(20);

// ============================================================
// OFFSET — "skip (page - 1) * limit rows". can jump to ANY page
// number, but gets slower the deeper you go.
//
// GET /activity/offset?page=1&limit=20
// ============================================================
const offsetQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: limitSchema,
});

export const pageByOffset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ---- validation (controller) ----
    const { page, limit } = offsetQuerySchema.parse(req.query);

    // ---- service logic: page number → rows to skip ----
    const offset = (page - 1) * limit;
    const label = `OFFSET ${offset.toLocaleString()}`;
    console.time(label);

    // ---- db query (repository) ----
    // postgres walks the index from the top and throws away the first
    // `offset` rows before returning `limit`. the deeper the page, the more
    // rows it reads and discards — page 500,000 reads ~10 million rows.
    const { rows } = await pool.query<ActivityRow>(
      `SELECT ${COLUMNS} FROM activity_logs
       ORDER BY id DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    console.timeEnd(label);
    res.json({ rows, page, offset });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// CURSOR (keyset) — "give me the rows after id X". same speed on
// every page, but you can only step first / prev / next / last —
// there is no "jump to page 250,000".
//
// GET /activity/cursor?limit=20       → first (newest) page
//                     ?after=<id>     → next page (older than id)
//                     ?before=<id>    → previous page (newer than id)
//                     ?last=true      → last (oldest) page
// ============================================================
const cursorQuerySchema = z.object({
  after: z.coerce.number().int().optional(),
  before: z.coerce.number().int().optional(),
  last: z.stringbool().optional(),
  limit: limitSchema,
});

export const pageByCursor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ---- validation (controller) ----
    const { after, before, last, limit } = cursorQuerySchema.parse(req.query);

    const label = `CURSOR ${
      after !== undefined ? `after ${after}` : before !== undefined ? `before ${before}` : last ? "last" : "first"
    }`;
    console.time(label);

    // ---- db query (repository) + service logic ----
    // every query fetches limit + 1 rows: if the extra row comes back,
    // there's another page in that direction — no COUNT(*) needed.
    // the WHERE id < / id > lets the primary-key index seek straight to
    // the cursor, so every page costs the same no matter how deep it is.
    let rows: ActivityRow[];
    let hasNewer: boolean;
    let hasOlder: boolean;

    if (after !== undefined) {
      // NEXT page: the rows just older than the cursor
      const result = await pool.query<ActivityRow>(
        `SELECT ${COLUMNS} FROM activity_logs
         WHERE id < $1
         ORDER BY id DESC
         LIMIT $2`,
        [after, limit + 1],
      );
      hasNewer = true; // we came from there
      hasOlder = result.rows.length > limit;
      rows = result.rows.slice(0, limit);
    } else if (before !== undefined) {
      // PREVIOUS page: the rows just newer than the cursor. walk the index
      // upward (ASC) to get the closest ones, then flip back to newest-first
      const result = await pool.query<ActivityRow>(
        `SELECT ${COLUMNS} FROM activity_logs
         WHERE id > $1
         ORDER BY id ASC
         LIMIT $2`,
        [before, limit + 1],
      );
      hasNewer = result.rows.length > limit;
      hasOlder = true; // we came from there
      rows = result.rows.slice(0, limit).reverse();
    } else if (last) {
      // LAST page: the oldest rows — start from the other end of the
      // index (ASC), then flip back to newest-first
      const result = await pool.query<ActivityRow>(
        `SELECT ${COLUMNS} FROM activity_logs
         ORDER BY id ASC
         LIMIT $1`,
        [limit + 1],
      );
      hasNewer = result.rows.length > limit;
      hasOlder = false;
      rows = result.rows.slice(0, limit).reverse();
    } else {
      // FIRST page: the newest rows, no cursor yet
      const result = await pool.query<ActivityRow>(
        `SELECT ${COLUMNS} FROM activity_logs
         ORDER BY id DESC
         LIMIT $1`,
        [limit + 1],
      );
      hasNewer = false;
      hasOlder = result.rows.length > limit;
      rows = result.rows.slice(0, limit);
    }

    console.timeEnd(label);
    res.json({
      rows,
      hasNewer,
      hasOlder,
      // hand these back on the next request as ?before= / ?after=
      prevCursor: rows[0]?.id ?? null,
      nextCursor: rows.at(-1)?.id ?? null,
    });
  } catch (err) {
    next(err);
  }
};

// ============================================================
// COUNT — offset pagination needs this to show "page X of Y", and
// on 10M rows COUNT(*) is itself a slow full scan. cursor
// pagination never needs it.
//
// GET /activity/count
// ============================================================
export const count = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    console.time("COUNT(*)");

    // ---- db query (repository) ----
    // ::int because pg returns COUNT's bigint as a string
    const { rows } = await pool.query<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM activity_logs`,
    );

    console.timeEnd("COUNT(*)");
    res.json({ total: rows[0].total });
  } catch (err) {
    next(err);
  }
};
