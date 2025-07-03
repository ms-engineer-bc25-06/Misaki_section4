// src/validators/transactionValidator.ts

import Joi from 'joi';

// 入出金データのバリデーションスキーマ
export const transactionSchema = Joi.object({
  date: Joi.string().isoDate().required(), // ISO形式の日付（例：2025-06-25）
  type: Joi.string().valid('収入', '支出').required(), // 入金 or 出金
  category: Joi.string().required(), // カテゴリ（必須）
  amount: Joi.number().positive().required(), // 金額（正の数）
  note: Joi.string().allow('').optional(), // メモ（空文字もOK）
});
