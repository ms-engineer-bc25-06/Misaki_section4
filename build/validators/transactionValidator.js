"use strict";
// src/validators/transactionValidator.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// 入出金データのバリデーションスキーマ
exports.transactionSchema = joi_1.default.object({
    date: joi_1.default.string().isoDate().required(), // ISO形式の日付（例：2025-06-25）
    type: joi_1.default.string().valid('収入', '支出').required(), // 入金 or 出金
    category: joi_1.default.string().required(), // カテゴリ（必須）
    amount: joi_1.default.number().positive().required(), // 金額（正の数）
    note: joi_1.default.string().allow('').optional(), // メモ（空文字もOK）
});
