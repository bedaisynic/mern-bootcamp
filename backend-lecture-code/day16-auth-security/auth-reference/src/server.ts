import "./env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import sessionRoutes from "./routes/session";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import adminRoutes from "./routes/admin";

const PORT = Number(process.env.PORT) || 4000;
const app = express();

// The frontend runs on a different origin (another port), so the browser only lets it read our
// responses if we allow that origin. credentials: true lets the session cookie through.
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "Day 16 auth reference API" });
});

app.use("/auth", authRoutes);
app.use("/session", sessionRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Auth reference API running on http://localhost:${PORT}`);
});
