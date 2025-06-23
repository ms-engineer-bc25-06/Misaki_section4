import express from "express";

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
router.get("/", (req, res) => {
  res.json(transactions);
});

// 詳細取得
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    return res.status(404).json({ error: "Not found" });
  }
  res.json(transaction);
});

// 新規作成
router.post("/", (req, res) => {
  const { date, type, category, amount, memo } = req.body;

  if (!date || !type || !category || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  if (type !== "income" && type !== "expense") {
    return res.status(400).json({ error: "Invalid type" });
  }

  const newTransaction: Transaction = {
    id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
    date,
    type,
    category,
    amount,
    memo,
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

// 更新
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  const { date, type, category, amount, memo } = req.body;

  if (!date || !type || !category || typeof amount !== "number") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  if (type !== "income" && type !== "expense") {
    return res.status(400).json({ error: "Invalid type" });
  }

  const updatedTransaction: Transaction = {
    id,
    date,
    type,
    category,
    amount,
    memo,
  };

  transactions[index] = updatedTransaction;
  res.json(updatedTransaction);
});

// 削除
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  transactions.splice(index, 1);
  res.json({ message: "Deleted successfully" });
});

export default router;
