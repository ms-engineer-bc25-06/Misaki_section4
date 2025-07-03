// src/tests/math.test.ts
import { describe, it, expect } from 'vitest'; // Vitestのグローバルが有効なら不要だが、明示的にインポートしても良い
import { add, subtract } from '../tests/math.js'; // ★ .js 拡張子を忘れずに！

describe('Math Utility Functions', () => {
  // 正常系のテストケース
  it('should correctly add two numbers', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(0, 0)).toBe(0);
    expect(add(-1, 1)).toBe(0);
    expect(add(100, 200)).toBe(300);
  });

  // 異常系（ただし、純粋関数なので異常系の入力は TypeScript で型チェックされることが多い）
  // 例: 文字列が渡された場合のテスト（ただし、TypeScriptがエラーを出すため、通常は不要）
  // it('should handle non-numeric input gracefully', () => {
  //   // TypeScriptでエラーになるため、このようなテストは通常書かない
  //   // @ts-expect-error
  //   expect(add('1', 2)).toBeNaN();
  // });

  // 別の関数の正常系テストケース
  it('should correctly subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
    expect(subtract(10, 10)).toBe(0);
    expect(subtract(0, 5)).toBe(-5);
  });
});
