import express, { RequestHandler } from "express";
import prisma from '../lib/prismaClient'  // ← Prisma Client をインポート
import { transactionSchema } from '../validators/transactionValidator';// バリデーションスキーマ
import Joi from 'joi'; 

const router = express.Router();

// 型定義
type Transaction = {
  id: number;
  date: Date;
  type: string;   
  category: string;
  amount: number;
  memo?: string | null;
};

// 一覧取得
router.get('/', async (req, res) => {
  try {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
  } catch (error) {
   res.status(500).json({error:"データ取得に失敗しました"});
  }
});



// 詳細取得
router.get("/:id",async (req, res) => {
  const id = Number(req.params.id);
  try {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(transaction);
}catch (error){
  res.status(500).json({ error: "取得に失敗しました"});
}
});

// 新規作成
//joiを使用
router.post("/",async(req, res) => {
const { error, value } = transactionSchema.validate(req.body);

if (error) {
  res.status(400).json({
    error: 'バリデーションエラー',
    details: error.details.map((d: Joi.ValidationErrorItem) => d.message),
  });
  return;
}
try {
  const newTransaction = await prisma.transaction.create({
    data:value,
  });
  res.status(201).json(newTransaction);
} catch (error) {
  res.status(500).json({ error:"登録に失敗しました"});
}
});


// 更新
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { error, value} = transactionSchema.validate(req.body);

  if (error) {
    res.status(400).json({ error: "バリデーションエラー" ,
    details: error.details.map((d) => d.message),
  });
  return;
  }

  try {
  const updatedTransaction: Transaction = await prisma.transaction.update({
      where: { id },
      data: value,
    });
    res.json(updatedTransaction);
  } catch (error) {
    res.status(404).json({ error: "Not found or 更新に失敗しました" });
  }
});


// 削除
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.transaction.delete({
      where: { id },
    });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: "Not found or 削除に失敗しました" });
  }
});


export default router;
