import express from 'express';
import prisma from '../libs/prismaClient.js'; // ← Prisma Client をインポート
import { transactionSchema } from '../validators/transactionValidator.js'; // バリデーションスキーマ

const router = express.Router();

// 一覧取得
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();
    res.json(transactions);
  } catch (_error) {
    res.status(500).json({ error: 'データ取得に失敗しました' });
  }
});

// 詳細取得
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(transaction);
  } catch (_error) {
    res.status(500).json({ error: '取得に失敗しました' });
  }
});

// 新規作成
router.post('/', async (req, res) => {
  const { error, value } = transactionSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: 'バリデーションエラー',
      details: error.details.map((d) => d.message),
    });
    return;
  }
  try {
    const newTransaction = await prisma.transaction.create({
      data: value,
    });
    res.status(201).json(newTransaction);
  } catch (_error) {
    res.status(500).json({ error: '登録に失敗しました' });
  }
});

// 更新
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { error, value } = transactionSchema.validate(req.body);

  if (error) {
    res.status(400).json({
      error: 'バリデーションエラー',
      details: error.details.map((d) => d.message),
    });
    return;
  }
  try {
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: value,
    });
    res.json(updatedTransaction);
  } catch (_error) {
    res.status(404).json({ error: 'Not found or 更新に失敗しました' });
  }
});

// 削除
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.transaction.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (_error) {
    res.status(404).json({ error: 'Not found or 削除に失敗しました' });
  }
});

export default router;
