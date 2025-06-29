"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prismaClient_1 = __importDefault(require("../lib/prismaClient")); // ← Prisma Client をインポート
const transactionValidator_1 = require("../validators/transactionValidator"); // バリデーションスキーマ
const router = express_1.default.Router();
// 一覧取得
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prismaClient_1.default.transaction.findMany();
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: "データ取得に失敗しました" });
    }
}));
// 詳細取得
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const transaction = yield prismaClient_1.default.transaction.findUnique({
            where: { id },
        });
        if (!transaction) {
            res.status(404).json({ error: "Not found" });
            return;
        }
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: "取得に失敗しました" });
    }
}));
// 新規作成
//joiを使用
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = transactionValidator_1.transactionSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            error: 'バリデーションエラー',
            details: error.details.map((d) => d.message),
        });
        return;
    }
    try {
        const newTransaction = yield prismaClient_1.default.transaction.create({
            data: value,
        });
        res.status(201).json(newTransaction);
    }
    catch (error) {
        res.status(500).json({ error: "登録に失敗しました" });
    }
}));
// 更新
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { error, value } = transactionValidator_1.transactionSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: "バリデーションエラー",
            details: error.details.map((d) => d.message),
        });
        return;
    }
    try {
        const updatedTransaction = yield prismaClient_1.default.transaction.update({
            where: { id },
            data: value,
        });
        res.json(updatedTransaction);
    }
    catch (error) {
        res.status(404).json({ error: "Not found or 更新に失敗しました" });
    }
}));
// 削除
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        yield prismaClient_1.default.transaction.delete({
            where: { id },
        });
        res.json({ message: "Deleted successfully" });
    }
    catch (error) {
        res.status(404).json({ error: "Not found or 削除に失敗しました" });
    }
}));
exports.default = router;
