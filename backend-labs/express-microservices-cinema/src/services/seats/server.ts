// given
import { createSeatsApp } from "./app";

const PORT = Number(process.env.PORT) || 3002;
createSeatsApp().listen(PORT, () => console.log(`seats service on http://localhost:${PORT}`));
