// src/routers/__tests__/transactions.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../app.js'; // Express アプリケーションインスタンスをインポート
import prisma from '../../libs/prismaClient.js'; // Prisma Client をインポート
// パスを修正: src/validators/transactionValidator.js を正しく参照
import { transactionSchema } from '../../validators/transactionValidator.js';

// テスト用のダミーデータ
// APIのバリデーションはYYYY-MM-DD形式の文字列を期待するので、ここでは文字列で定義
const TEST_TRANSACTION = {
  date: '2024-07-03',
  type: '支出',
  category: '食費',
  amount: 1500,
  note: 'ランチ代',
};

// 更新テスト用のデータ
const UPDATED_TRANSACTION_DATA = {
  date: '2024-07-04',
  type: '収入',
  category: '給料',
  amount: 300000,
  note: '今月の給料',
};

// --- テスト開始 ---
describe('Transactions API', () => {
  // 各テストの前に実行される処理
  beforeEach(async () => {
    await prisma.transaction.deleteMany({}); // 既存のデータを全て削除
  });

  // 各テスト終了時に実行される処理
  afterAll(async () => {
    await prisma.$disconnect(); // 全てのテストが完了したら、データベース接続を閉じる
  });

  // --- 取得 /api/transactions ---
  describe('GET /api/transactions', () => {
    it('should return an empty array if no transactions exist', async () => {
      const response = await request(app).get('/api/transactions');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return a list of transactions', async () => {
      // PrismaにはDateオブジェクトで渡す必要があるため、ここで変換
      await prisma.transaction.create({
        data: { ...TEST_TRANSACTION, date: new Date(TEST_TRANSACTION.date) },
      });
      await prisma.transaction.create({
        data: {
          ...TEST_TRANSACTION,
          date: new Date('2024-07-05'),
          amount: 2000,
          note: 'カフェ',
        },
      });

      const response = await request(app).get('/api/transactions');

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0].date).toBe(TEST_TRANSACTION.date);
      expect(response.body[0].category).toBe(TEST_TRANSACTION.category);
    });
  });

  // --- 新規作成 /api/transactions ---
  describe('POST /api/transactions', () => {
    it('should create a new transaction with valid data', async () => {
      const response = await request(app)
        .post('/api/transactions')
        .send(TEST_TRANSACTION);

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject(TEST_TRANSACTION);
      expect(response.body).toHaveProperty('id');

      const createdTransaction = await prisma.transaction.findUnique({
        where: { id: response.body.id },
      });
      expect(createdTransaction).not.toBeNull();
      expect(createdTransaction?.amount).toBe(TEST_TRANSACTION.amount);
      // データベースに保存されたdateはDateTime型なので、toISOString()で比較
      expect(
        createdTransaction?.date
          .toISOString()
          .startsWith(TEST_TRANSACTION.date),
      ).toBe(true);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidData = { ...TEST_TRANSACTION, date: undefined };
      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('バリデーションエラー');
      expect(response.body.details).toContain('Required');
    });

    it('should return 400 for invalid data types', async () => {
      const invalidData = { ...TEST_TRANSACTION, amount: 'abc' };
      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData);

      expect(response.statusCode).toBe(400);
      expect(response.body.details).toContain(
        'Expected number, received string',
      );
    });

    it('should return 400 for non-positive amount', async () => {
      const invalidData = { ...TEST_TRANSACTION, amount: -100 };
      const response = await request(app)
        .post('/api/transactions')
        .send(invalidData);

      expect(response.statusCode).toBe(400);
      expect(response.body.details).toContain(
        'Amount must be a positive number',
      );
    });
  });

  // --- 取得 /api/transactions/:id ---
  describe('GET /api/transactions/:id', () => {
    let createdTransaction: any;

    beforeEach(async () => {
      createdTransaction = await prisma.transaction.create({
        data: { ...TEST_TRANSACTION, date: new Date(TEST_TRANSACTION.date) },
      });
    });

    it('should return the transaction for a valid ID', async () => {
      const response = await request(app).get(
        `/api/transactions/${createdTransaction.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(TEST_TRANSACTION);
      expect(response.body.id).toBe(createdTransaction.id);
    });

    it('should return 404 for a non-existent ID', async () => {
      const nonExistentId = createdTransaction.id + 999;
      const response = await request(app).get(
        `/api/transactions/${nonExistentId}`,
      );

      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe('Not found');
    });

    it('should return 400 for an invalid ID format', async () => {
      // 期待値を400に修正
      const response = await request(app).get('/api/transactions/abc');

      expect(response.statusCode).toBe(400); // API側で400を返すように修正したため
      expect(response.body.error).toBe('Invalid ID format'); // API側で返すメッセージに合わせる
    });
  });

  // --- 更新 /api/transactions/:id ---
  describe('PUT /api/transactions/:id', () => {
    let createdTransaction: any;

    beforeEach(async () => {
      createdTransaction = await prisma.transaction.create({
        data: { ...TEST_TRANSACTION, date: new Date(TEST_TRANSACTION.date) },
      });
    });

    it('should update a transaction with valid data', async () => {
      const response = await request(app)
        .put(`/api/transactions/${createdTransaction.id}`)
        .send(UPDATED_TRANSACTION_DATA);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(createdTransaction.id);
      expect(response.body).toMatchObject(UPDATED_TRANSACTION_DATA);

      const fetchedTransaction = await prisma.transaction.findUnique({
        where: { id: createdTransaction.id },
      });
      expect(fetchedTransaction).not.toBeNull();
      expect(fetchedTransaction?.amount).toBe(UPDATED_TRANSACTION_DATA.amount);
      expect(
        fetchedTransaction?.date
          .toISOString()
          .startsWith(UPDATED_TRANSACTION_DATA.date),
      ).toBe(true);
    });

    it('should return 404 for updating a non-existent transaction', async () => {
      const nonExistentId = createdTransaction.id + 999;
      const response = await request(app)
        .put(`/api/transactions/${nonExistentId}`)
        .send(TEST_TRANSACTION);

      expect(response.statusCode).toBe(404); // API側で404を返すように修正したため
      expect(response.body.error).toBe('Transaction not found'); // API側で返すメッセージに合わせる
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = { ...UPDATED_TRANSACTION_DATA, amount: -50 };
      const response = await request(app)
        .put(`/api/transactions/${createdTransaction.id}`)
        .send(invalidData);

      expect(response.statusCode).toBe(400);
      expect(response.body.details).toContain(
        'Amount must be a positive number',
      );
    });
  });

  // --- 消す /api/transactions/:id ---
  describe('DELETE /api/transactions/:id', () => {
    let createdTransaction: any;

    beforeEach(async () => {
      createdTransaction = await prisma.transaction.create({
        data: { ...TEST_TRANSACTION, date: new Date(TEST_TRANSACTION.date) },
      });
    });

    it('should delete a transaction for a valid ID', async () => {
      const response = await request(app).delete(
        `/api/transactions/${createdTransaction.id}`,
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Deleted successfully'); // API側で返すメッセージに合わせる

      const deletedTransaction = await prisma.transaction.findUnique({
        where: { id: createdTransaction.id },
      });
      expect(deletedTransaction).toBeNull();
    });

    it('should return 404 for deleting a non-existent transaction', async () => {
      const nonExistentId = createdTransaction.id + 999;
      const response = await request(app).delete(
        `/api/transactions/${nonExistentId}`,
      );

      expect(response.statusCode).toBe(404); // API側で404を返すように修正したため
      expect(response.body.error).toBe('削除失敗'); // API側で返すメッセージに合わせる
    });
  });
});
