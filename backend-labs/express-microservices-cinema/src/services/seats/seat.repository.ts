// given — this service's own data: which seats are held, per showtime.

export type Hold = {
  id: number;
  showtimeId: number;
  seats: string[];
  status: "held" | "released";
};

// Showtime 1 starts with C4 and C5 already sold.
const SEED: Omit<Hold, "id">[] = [{ showtimeId: 1, seats: ["C4", "C5"], status: "held" }];

let holds: Hold[] = [];
let nextId = 1;

export const seatRepository = {
  reset(): void {
    holds = SEED.map((h, i) => ({ ...h, id: i + 1, seats: [...h.seats] }));
    nextId = holds.length + 1;
  },

  takenSeats(showtimeId: number): string[] {
    return holds
      .filter((h) => h.showtimeId === showtimeId && h.status === "held")
      .flatMap((h) => h.seats);
  },

  create(showtimeId: number, seats: string[]): Hold {
    const hold: Hold = { id: nextId++, showtimeId, seats: [...seats], status: "held" };
    holds.push(hold);
    return hold;
  },

  findById(id: number): Hold | null {
    return holds.find((h) => h.id === id) ?? null;
  },

  markReleased(id: number): void {
    const hold = holds.find((h) => h.id === id);
    if (hold) hold.status = "released";
  },
};
