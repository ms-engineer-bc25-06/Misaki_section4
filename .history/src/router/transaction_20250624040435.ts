import express, { Request, Response, RequestHandler } from "express";

const router = express.Router();

type Transaction = {
  id: number;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  memo?: string;
};

let transactions: Transaction[] = [
  {
    id: 1,
    date: "2025-06-01",
    type: "expense",
    category: "食費",
    amount: 1500,
  },
  {
    id: 2,
    date: "2025-06-02",
    type: "income",
    category: "給料",
    amount: 250000,
  },
  {
    id: 3,
    date: "2025-06-18",
    type: "expense",
    category: "光熱費",
    amount: 7000,
    memo: "電気代",
  },
];

// 一覧取得
const getTransactions: RequestHandler = (req, res) => {
  res.json(transactions);
};
router.get("/", getTransactions);

// 詳細取得
const getTransactionById: RequestHandler<{ id: string }> = (req, res) => {
  const id = Number(req.params.id);
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(tr
