// given
import { createPaymentsApp } from "./app";

const PORT = Number(process.env.PORT) || 3003;
createPaymentsApp().listen(PORT, () => console.log(`payments service on http://localhost:${PORT}`));
