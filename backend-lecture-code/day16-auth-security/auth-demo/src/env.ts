import dotenv from "dotenv";

// Imported first in server.ts so .env is loaded before anything reads process.env.
dotenv.config({ quiet: true });
