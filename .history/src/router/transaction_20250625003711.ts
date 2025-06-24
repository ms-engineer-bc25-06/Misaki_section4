//import express, { RequestHandler } from "express";
import { Router, RequestHandler } from "express";

//const router = express.Router();
const router = Router();

const getTransactions: RequestHandler = (req, res) => {
  res.json([
    { id: 1, date: "2025-06-01", type: "expense", category: "食費", amount: 1500 },
  ]);
};

router.get("/", getTransactions);

export default router;

//型定義
// type Transaction = {
//   id: number;
//   date: string;
//   type: "income" | "expense";
//   category: string;
//   amount: number;
//   memo?: string;
// };

// let transactions: Transaction[] = [
//   {
//     id: 1,
//     date: "2025-06-01",
//     type: "expense",
//     category: "食費",
//     amount: 1500,
//   },
//   {
//     id: 2,
//     date: "2025-06-02",
//     type: "income",
//     category: "給料",
//     amount: 250000,
//   },
//   {
//     id: 3,
//     date: "2025-06-18",
//     type: "expense",
//     category: "光熱費",
//     amount: 7000,
//     memo: "電気代",
//   },
// ];

// // 一覧取得
// const getTransactions: RequestHandler = (req, res) => {
//   res.json(transactions);
// };
// router.get("/", getTransactions);

// // 詳細取得
// const getTransactionById: RequestHandler<{ id: string }> = (req, res) => {
//   const id = Number(req.params.id);
//   const transaction = transactions.find((t) => t.id === id);
//   if (!transaction) {
//     res.status(404).json({ error: "Not found" });
//     return;
//   }
//   res.json(transaction);
// };
// router.get("/:id", getTransactionById);

// // 新規作成
// const createTransaction: RequestHandler = (req, res) => {
//   const { date, type, category, amount, memo } = req.body;

//   if (!date || !type || !category || typeof amount !== "number") {
//     res.status(400).json({ error: "Invalid request data" });
//     return;
//   }

//   if (type !== "income" && type !== "expense") {
//     res.status(400).json({ error: "Invalid type" });
//     return;
//   }

//   const newTransaction: Transaction = {
//     id: transactions.length ? transactions[transactions.length - 1].id + 1 : 1,
//     date,
//     type,
//     category,
//     amount,
//     memo,
//   };

//   transactions.push(newTransaction);
//   res.status(201).json(newTransaction);
// };
// router.post("/", createTransaction);

// // 更新
// const updateTransaction: RequestHandler<{ id: string }> = (req, res) => {
//   const id = Number(req.params.id);
//   const index = transactions.findIndex((t) => t.id === id);
//   if (index === -1) {
//     res.status(404).json({ error: "Not found" });
//     return;
//   }

//   const { date, type, category, amount, memo } = req.body;

//   if (!date || !type || !category || typeof amount !== "number") {
//     res.status(400).json({ error: "Invalid request data" });
//     return;
//   }

//   if (type !== "income" && type !== "expense") {
//     res.status(400).json({ error: "Invalid type" });
//     return;
//   }

//   const updatedTransaction: Transaction = {
//     id,
//     date,
//     type,
//     category,
//     amount,
//     memo,
//   };

//   transactions[index] = updatedTransaction;
//   res.json(updatedTransaction);
// };
// router.put("/:id", updateTransaction);

// // 削除
// const deleteTransaction: RequestHandler<{ id: string }> = (req, res) => {
//   const id = Number(req.params.id);
//   const index = transactions.findIndex((t) => t.id === id);
//   if (index === -1) {
//     res.status(404).json({ error: "Not found" });
//     return;
//   }

//   transactions.splice(index, 1);
//   res.json({ message: "Deleted successfully" });
// };
// router.delete("/:id", deleteTransaction);

// export default router;
