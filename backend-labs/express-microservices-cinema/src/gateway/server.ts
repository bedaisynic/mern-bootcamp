// given
import { createGatewayApp } from "./app";

const PORT = Number(process.env.PORT) || 3000;

const app = createGatewayApp({
  movies: process.env.MOVIES_URL ?? "http://localhost:3001",
  seats: process.env.SEATS_URL ?? "http://localhost:3002",
  payments: process.env.PAYMENTS_URL ?? "http://localhost:3003",
  notifications: process.env.NOTIFICATIONS_URL ?? "http://localhost:3004",
  bookings: process.env.BOOKINGS_URL ?? "http://localhost:3005",
});

app.listen(PORT, () => console.log(`API gateway on http://localhost:${PORT}`));
