// given
import { createNotificationsApp } from "./app";

const PORT = Number(process.env.PORT) || 3004;
createNotificationsApp().listen(PORT, () => console.log(`notifications service on http://localhost:${PORT}`));
