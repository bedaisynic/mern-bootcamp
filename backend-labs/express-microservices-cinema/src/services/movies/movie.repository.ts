// REFERENCE — fully implemented. Read this service top to bottom before you
// start: repository → service → controller → routes → app → server.
//
// DATA ACCESS ONLY. This service's data lives in memory, in this file, and
// nowhere else: no other service can read it except by calling this
// service's API. (In memory, so these are plain synchronous functions. With a
// real database they'd be async.)

export type Showtime = {
  id: number;
  movieTitle: string;
  hall: string;
  startsAt: string;
  price: number;
};

const SEED: Showtime[] = [
  { id: 1, movieTitle: "Dune: Part Three", hall: "1", startsAt: "2026-10-02T19:00:00.000Z", price: 15 },
  { id: 2, movieTitle: "Dune: Part Three (IMAX)", hall: "IMAX", startsAt: "2026-10-02T20:30:00.000Z", price: 60 },
  { id: 3, movieTitle: "The Grand Budapest Hotel", hall: "2", startsAt: "2026-10-03T18:00:00.000Z", price: 12 },
];

let showtimes: Showtime[] = [];

export const movieRepository = {
  /** Back to the seed data. Called whenever the app is created. */
  reset(): void {
    showtimes = SEED.map((s) => ({ ...s }));
  },

  findAll(): Showtime[] {
    return showtimes;
  },

  findById(id: number): Showtime | null {
    return showtimes.find((s) => s.id === id) ?? null;
  },
};
