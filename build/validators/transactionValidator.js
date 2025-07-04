// src/validators/transactionValidator.ts
import { z } from 'zod'; // Zodをインポート
// 入出金データのバリデーションスキーマ (Zod版)
export const transactionSchema = z.object({
    // 日付はYYYY-MM-DD形式の文字列を期待
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'), // .required() を削除
    type: z.enum(['収入', '支出']), // .required() を削除
    category: z.string().min(1, 'Category cannot be empty'), // .required() を削除
    amount: z.number().positive('Amount must be a positive number'), // .required() を削除
    note: z.string().optional(), // メモ（省略可能、空文字も含む）
});
