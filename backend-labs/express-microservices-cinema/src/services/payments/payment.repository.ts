// given — this service's own data: every charge it has made.

export type Charge = {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  status: "approved" | "declined" | "refunded";
};

let charges: Charge[] = [];
let nextId = 1;

export const paymentRepository = {
  reset(): void {
    charges = [];
    nextId = 1;
  },

  create(input: Omit<Charge, "id">): Charge {
    const charge: Charge = { id: nextId++, ...input };
    charges.push(charge);
    return { ...charge };
  },

  findById(id: number): Charge | null {
    const charge = charges.find((c) => c.id === id);
    return charge ? { ...charge } : null;
  },

  markRefunded(id: number): Charge {
    const charge = charges.find((c) => c.id === id)!;
    charge.status = "refunded";
    return { ...charge };
  },
};
