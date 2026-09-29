// given
import { createMoviesApp } from "./app";

const PORT = Number(process.env.PORT) || 3001;
createMoviesApp().listen(PORT, () => console.log(`movies service on http://localhost:${PORT}`));
