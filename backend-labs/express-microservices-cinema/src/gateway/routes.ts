// given — never edit this file. The routing table: the first path segment
// decides which service gets the request. Nothing under /internal is listed,
// so internal endpoints can't be reached from outside.

export type ServiceName = "movies" | "seats" | "payments" | "notifications" | "bookings";

export type Route = {
  service: ServiceName;
  /** Can this request go through without a token? */
  isPublic: (method: string, path: string) => boolean;
};

export const ROUTES: Record<string, Route> = {
  showtimes: { service: "movies", isPublic: (method) => method === "GET" },
  seats: { service: "seats", isPublic: (method) => method === "GET" },
  bookings: { service: "bookings", isPublic: () => false },
  notifications: { service: "notifications", isPublic: () => false },
  payments: { service: "payments", isPublic: (_method, path) => path.startsWith("/payments/debug/") },
};
