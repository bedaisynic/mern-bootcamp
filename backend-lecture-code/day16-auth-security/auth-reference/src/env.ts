import dotenv from "dotenv";

// Imported first in server.ts so .env is loaded before anything reads process.env.
dotenv.config({ quiet: true });

for (const name of ["JWT_SECRET", "FRONTEND_ORIGIN", "FRONTEND_URL"]) {
  if (!process.env[name]) {
    throw new Error(`Missing ${name} — copy .env.example to .env and fill it in.`);
  }
}
