// validators/transactionValidator.test.ts
import { describe, it, expect } from 'vitest';
import { transactionSchema } from './transactionValidator';
//正常系
describe('取引バリデーションスキーマ', () => {
  it('正しいデータは通る', () => {
    const result = transactionSchema.validate({
      date: '2025-07-02',
      type: '収入',
      category: '給料',
      amount: 20000,
    });
    expect(result.error).toBeUndefined();
  });
  //異常系
  it('amountが文字列だとエラー', () => {
    const result = transactionSchema.validate({
      date: '2025-07-02',
      type: '収入',
      category: '給料',
      amount: 'abc', // ← ここが不正
    });
    expect(result.error).toBeDefined();
  });
});
