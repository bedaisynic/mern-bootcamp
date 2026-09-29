import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "service-a", status: "ok" });
});

app.get("/foo", async (req, res) => {
  const response = await fetch("http://localhost:3002/health");
  const data = await response.json();
  console.log(data);

  res.send("hello");
});

app.listen(PORT, () => {
  console.log(`service-a listening on http://localhost:${PORT}`);
});
