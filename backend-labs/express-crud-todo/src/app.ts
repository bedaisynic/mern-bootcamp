import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

interface Transaction {
  transactionId: string;
  amount: number;
  currency: string;
  userId: string;
  status: "Pending" | "Completed";
}

const DATA_FILE = path.join(__dirname, "../data/transactions.json");

// ========================================================================
// Already wired up for you — read/write the JSON file that backs this API.
function readTransactions(): Transaction[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeTransactions(transactions: Transaction[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(transactions, null, 2));
}
// ========================================================================

const app = express();

app.use(express.json());

// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello Daisy!" });
// });

// {
//   "amount": 100,
//   "currency": "USD",
//   "userId": "123"
// }

// - `POST /transactions`
// - Request body: `{ amount, currency, userId }`
// - Creates a transaction with a generated `transactionId`, starting `status: "Pending"`.
// - Response: `201 Created` with the created transaction.

app.post("/transactions", (req: Request, res: Response) => {
  const { amount, currency, userId } = req.body;

  const transactions = readTransactions();

  const transaction: Transaction = {
    transactionId: randomUUID(),
    amount,
    currency,
    userId,
    status: "Pending",
  };

  transactions.push(transaction);
  writeTransactions(transactions);

  res.status(201).json(transaction);
});

// ### 2. Retrieve a transaction by ID

// - `GET /transactions/:transactionId`
// - `200 OK` with the transaction if found.
// - `404 Not Found` with `{ "message": "Transaction not found" }` if not.

app.get("/transactions/:transactionId", (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const transactions = readTransactions();

  const transaction = transactions.find(
    (trans) => trans.transactionId === transactionId,
  );

  if (!transaction) {
    return res.status(404).json({
      message: "Transaction not found",
    });
  }

  res.status(200).json(transaction);
});

// - `PUT /transactions/:transactionId`
// - Request body: `{ "status": "Completed" }`
// - `200 OK` with `{ transactionId, status }` if found.
// - `404 Not Found` with `{ "message": "Transaction not found" }` if not.

app.put("/transactions/:transactionId", (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const { status } = req.body;

  const transactions = readTransactions();

  const transaction = transactions.find(
    (trans) => trans.transactionId === transactionId,
  );

  if (!transaction) {
    return res.status(404).json({
      message: "Transaction not found",
    });
  }

  transaction.status = status;

  writeTransactions(transactions);

  res.status(200).json({
    transactionId: transaction.transactionId,
    status: transaction.status,
  });
});

// ### 4. List all transactions

// - `GET /transactions`
// - `200 OK` with an array of every transaction.
app.get("/transactions", (req: Request, res: Response) => {
  const transactions = readTransactions();

  if (!transactions) {
    return res.status(404).json({
      message: "Transaction list not found",
    });
  }
  res.status(200).json(transactions);
});

// ### 5. Delete a transaction

// - `DELETE /transactions/:transactionId`
// - `200 OK` with `{ "message": "Transaction deleted successfully" }` if found.
// - `404 Not Found` with `{ "message": "Transaction not found" }` if not.

app.delete("/transactions/:transactionId", (req: Request, res: Response) => {
  const { transactionId } = req.params;

  const transactions = readTransactions();

  const idx = transactions.findIndex(
    (trans) => trans.transactionId === transactionId,
  );

  if (idx === -1) {
    return res.status(404).json({
      message: "Transaction not found",
    });
  }

  transactions.splice(idx, 1);

  writeTransactions(transactions);

  res.status(200).json({
    message: "Transaction deleted successfully",
  });
});

// Registered last — Express 4 catches a synchronous throw from a route
// handler above and forwards it here automatically.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message ?? "Internal server error" });
});

export default app;
