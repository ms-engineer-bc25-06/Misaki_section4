import express, { RequestHandler } from "express";
import { transactionSchema } from '../validators/transactionValidator';// バリデーションスキーマ
import Joi from 'joi'; 

const router = express.Router();

// 型定義
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
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(transaction);
};
router.get("/:id", getTransactionById);

// 新規作成
//joiを使用
const createTransaction: RequestHandler = (req, res) => {
const { error, value } = transactionSchema.validate(req.body);

if (error) {
  res.status(400).json({
    error: 'バリデーションエラー',
    details: error.details.map(d => d.message),
  });
  return
}
  const newTransaction: Transaction = {
    id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
    ...value,//Joiでバリデートされた安全なデータ
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
};
router.post("/", createTransaction);


// 更新
const updateTransaction: RequestHandler<{ id: string }> = (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  const { error, value } = transactionSchema.validate(req.body);


  if (error) {
    return res.status(400).json({ error: "バリデーションエラー" ,
    details: error.details.map(d => d.message),
  });
  }

  const updatedTransaction: Transaction = {
    id,
    ...value,
  };

  transactions[index] = updatedTransaction;
  res.json(updatedTransaction);
};

router.put("/:id", updateTransaction);

// 削除
const deleteTransaction: RequestHandler<{ id: string }> = (req, res) => {
  const id = Number(req.params.id);
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  transactions.splice(index, 1);
  res.json({ message: "Deleted successfully" });
};
router.delete("/:id", deleteTransaction);

export default router;
