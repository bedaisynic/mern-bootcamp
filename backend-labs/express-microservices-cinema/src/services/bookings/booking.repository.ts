// given — never edit this file. This service's own data, and nothing else:
// there are no showtimes, seats, or payments in here, only the ids and the
// details copied in when the booking was made.

export type BookingStatus = "pending_payment" | "confirmed" | "payment_failed" | "cancelled";

export type Booking = {
  id: number;
  userId: number;
  showtimeId: number;
  movieTitle: string; // snapshot, copied from movies at booking time
  startsAt: string; //   snapshot
  seats: string[];
  total: number; //      snapshot of price × seats
  status: BookingStatus;
  holdId: number; //     from the seats service, needed to release the seats
  paymentId: number | null; // from the payments service, needed to refund
};

let bookings: Booking[] = [];
let nextId = 1;

const copy = (b: Booking): Booking => ({ ...b, seats: [...b.seats] });

function update(id: number, changes: Partial<Booking>): Booking {
  const booking = bookings.find((b) => b.id === id);
  if (!booking) throw new Error(`booking ${id} not found`);
  Object.assign(booking, changes);
  return copy(booking);
}

export const bookingRepository = {
  reset(): void {
    bookings = [];
    nextId = 1;
  },

  /** Saves a new booking with status "pending_payment" and no paymentId yet. */
  createPending(input: Omit<Booking, "id" | "status" | "paymentId">): Booking {
    const booking: Booking = { ...input, seats: [...input.seats], id: nextId++, status: "pending_payment", paymentId: null };
    bookings.push(booking);
    return copy(booking);
  },

  markConfirmed(id: number, paymentId: number): Booking {
    return update(id, { status: "confirmed", paymentId });
  },

  markPaymentFailed(id: number): Booking {
    return update(id, { status: "payment_failed" });
  },

  markCancelled(id: number): Booking {
    return update(id, { status: "cancelled" });
  },

  findByIdForUser(id: number, userId: number): Booking | null {
    const booking = bookings.find((b) => b.id === id && b.userId === userId);
    return booking ? copy(booking) : null;
  },

  findByUser(userId: number): Booking[] {
    return bookings.filter((b) => b.userId === userId).reverse().map(copy);
  },
};
