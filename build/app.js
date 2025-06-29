"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_1 = __importDefault(require("./router/user"));
const transaction_1 = __importDefault(require("./router/transaction"));
// loggerの設定
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info', //環境変数から取得なければ info
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), //タイムスタンプ
    winston_1.default.format.colorize(), //色付け（開発時のみ）
    //winston.format.json(),//本番ログ　JSON形式
    winston_1.default.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`) //見やすくするため（開発時のみ）
    ),
    transports: [new winston_1.default.transports.Console()],
});
// express
const app = (0, express_1.default)();
const port = 4000;
//Next.jsアクセス許可
app.use((0, cors_1.default)());
// morgan設定
const stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
app.use((0, morgan_1.default)('combined', { stream }));
//ミドルウェア（リクエストの内容をJSON形式で受け取る設定）
app.use(express_1.default.json());
//ここにエンドポイントを追加していく（内容はrouterの中に記載）
app.use('/user', user_1.default);
app.use('/api/transactions', transaction_1.default);
// http://localhost:4000(GET)にアクセスした際の処理
app.get('/', (req, res) => {
    logger.debug('GET / にアクセスされました'); // ← ここにログ追加
    res.send('Hello World!!');
});
//エラー処理
app.get('/error', (req, res, next) => {
    next(new Error('テストエラー'));
});
// エラーハンドラ
app.use((err, req, res, next) => {
    logger.error(`エラー: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
});
// 確認用
app.listen(port, () => {
    logger.info(`Server running on http://localhost:${port}`);
});
