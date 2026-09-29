// given
import { createBookingsApp } from "./app";

const PORT = Number(process.env.PORT) || 3005;
createBookingsApp().listen(PORT, () => console.log(`bookings service on http://localhost:${PORT}`));
