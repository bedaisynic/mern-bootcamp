import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3002;

app.use(express.json());

// order
app.get("/health", (_req, res) => {
  res.json({ service: "service-b", status: "ok" });
});


app.post("/order", ()=>{
  // place order

  // UPDATE orders WHERE order_id = 1

  // PATCH /users
  // PATCH /inventory/:productId

})


app.listen(PORT, () => {
  console.log(`service-b listening on http://localhost:${PORT}`);
});
