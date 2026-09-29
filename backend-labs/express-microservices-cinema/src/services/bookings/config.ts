// given — where the other services live. Each is a separate process on its
// own port; bookings only ever reaches them over HTTP. The tests override
// these with the random ports they start the services on.

export type ServiceName = "movies" | "seats" | "payments" | "notifications";

export const serviceUrls: Record<ServiceName, string> = {
  movies: process.env.MOVIES_URL ?? "http://localhost:3001",
  seats: process.env.SEATS_URL ?? "http://localhost:3002",
  payments: process.env.PAYMENTS_URL ?? "http://localhost:3003",
  notifications: process.env.NOTIFICATIONS_URL ?? "http://localhost:3004",
};

export function setServiceUrls(urls: Partial<Record<ServiceName, string>>): void {
  Object.assign(serviceUrls, urls);
}
