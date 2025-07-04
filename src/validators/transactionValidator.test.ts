// src/validators/transactionValidator.test.ts
import { describe, it, expect } from 'vitest';
import { transactionSchema } from './transactionValidator.js'; // Zodスキーマをインポート

describe('取引バリデーションスキーマ', () => {
  // 正常系テスト
  it('正しいデータは通る', () => {
    const validData = {
      date: '2025-07-02',
      type: '収入',
      category: '給料',
      amount: 100000,
      note: '今月の給料',
    };
    const result = transactionSchema.safeParse(validData); // ZodのsafeParseを使用

    expect(result.success).toBe(true); // 成功することを期待
    expect(result.data).toEqual(validData); // データが一致することを期待
  });

  it('メモがなくても正しいデータは通る', () => {
    const validData = {
      date: '2025-07-02',
      type: '支出',
      category: '食費',
      amount: 500,
    };
    const result = transactionSchema.safeParse(validData);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ ...validData, note: undefined }); // noteがundefinedになることを期待
  });

  // 異常系テスト
  it('amountが文字列だとエラー', () => {
    const invalidData = {
      date: '2025-07-02',
      type: '収入',
      category: '給料',
      amount: 'abc', // 文字列
    };
    const result = transactionSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toBe(
      'Expected number, received string',
    );
  });
});
