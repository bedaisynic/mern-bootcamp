import express from "express";
import cors from "cors";
import routes from "./routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

app.use("/api", async (req, res, next) => {
    await sleep(550); // Simulate network delay
    next();
}, routes);

app.use(errorHandler);

export default app;
