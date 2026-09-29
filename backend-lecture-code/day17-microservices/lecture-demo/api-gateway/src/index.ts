import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ service: "api-gateway", status: "ok" });
});

// user
app.get("/",()=>{
  // if i receive users request
  // forward to 3001
  
  
  // if i receive orders request
  // forward to 3002




})

app.listen(PORT, () => {
  console.log(`api-gateway listening on http://localhost:${PORT}`);
});
