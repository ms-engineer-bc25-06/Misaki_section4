// src/routers/transaction.ts
import express, { Request, Response } from 'express';
import prisma from '../libs/prismaClient.js'; //jsをつけることでビルド後にNodeが参照
import { transactionSchema } from '../validators/transactionValidator.js'; // Zodのバリデーションスキーマを使用

const router = express.Router(); // Expressルーターインスタンスを作成

// 日付整形用のヘルパー関数
// Dateオブジェクトを 'YYYY-MM-DD' 形式の文字列に変換します
const formatDate = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 一覧取得 (GET /api/transactions)
router.get('/', async (_req: Request, res: Response) => {
  // reqは使用しないので_reqに変更
  try {
    const transactions = await prisma.transaction.findMany();
    // 取得した各取引の日付を整形
    const formattedTransactions = transactions.map((t) => ({
      ...t,
      date: formatDate(t.date), // Dateオブジェクトを整形
    }));
    res.json(formattedTransactions); // 整形済みのデータを返す
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'データ取得に失敗しました' });
    return;
  }
});

// 詳細取得 (GET /api/transactions/:id)
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  // IDが有効な数値でない場合の早期リターン
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const formattedTransaction = {
      ...transaction,
      date: formatDate(transaction.date),
    };
    res.json(formattedTransaction);
  } catch (error) {
    console.error('Error fetching transaction detail:', error);
    res.status(500).json({ error: '取得に失敗しました' });
    return;
  }
});

// 新規作成 (POST /api/transactions)
router.post('/', async (req: Request, res: Response) => {
  const { success, error, data } = transactionSchema.safeParse(req.body);

  if (!success) {
    // Zodのエラーをテストの期待値に合わせて整形
    res.status(400).json({
      error: 'バリデーションエラー', // テストの期待値に合わせる
      details: error.errors.map((e) => e.message), // Zodのエラーメッセージを抽出
    });
    return;
  }

  try {
    const newTransaction = await prisma.transaction.create({
      data: {
        ...data,
        date: new Date(data.date), // Zodでバリデーションされた文字列をDateオブジェクトに変換
      },
    });
    const formattedNewTransaction = {
      ...newTransaction,
      date: formatDate(newTransaction.date),
    };
    res.status(201).json(formattedNewTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: '作成に失敗しました' });
    return;
  }
});

// 更新 (PUT /api/transactions/:id)
router.put('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  const { success, error, data } = transactionSchema.safeParse(req.body);

  if (!success) {
    // Zodのエラーをテストの期待値に合わせて整形
    res.status(400).json({
      error: 'バリデーションエラー', // テストの期待値に合わせる
      details: error.errors.map((e) => e.message),
    });
    return;
  }

  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...data,
        date: new Date(data.date), // Zodでバリデーションされた文字列をDateオブジェクトに変換
      },
    });
    const formattedUpdatedTransaction = {
      ...updatedTransaction,
      date: formatDate(updatedTransaction.date),
    };
    res.json(formattedUpdatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof Error && (error as any).code === 'P2025') {
      res.status(404).json({ error: 'Transaction not found' }); // テストの期待値に合わせる
      return;
    }
    res.status(500).json({ error: '更新に失敗しました' });
  }
  return;
});

// 削除 (DELETE /api/transactions/:id)
router.delete('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID format' });
    return;
  }

  try {
    await prisma.transaction.delete({ where: { id } });
    res.status(200).json({ message: 'Deleted successfully' }); // テストの期待値に合わせる
  } catch (error) {
    console.error('Error deleting transaction:', error);
    if (error instanceof Error && (error as any).code === 'P2025') {
      res.status(404).json({ error: 'Not found or 削除に失敗しました' }); // テストの期待値に合わせる
      return;
    }
    res.status(500).json({ error: '削除に失敗しました' });
    return;
  }
});

export default router;
