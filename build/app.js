// src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston';
import dotenv from 'dotenv';
dotenv.config();
import userRouter from './routers/user.js';
import transactionRouter from './routers/transaction.js';
// loggerの設定
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', //環境変数から取得なければ info
    format: winston.format.combine(winston.format.timestamp(), //タイムスタンプ
    winston.format.colorize(), //色付け（開発時のみ）
    //winston.format.json(),//本番ログJSON形式
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)),
    transports: [new winston.transports.Console()],
});
// express
const app = express();
const port = 4000;
//Next.jsアクセス許可
app.use(cors());
// morgan設定
const stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
app.use(morgan('combined', { stream }));
//ミドルウェア（リクエストの内容をJSON形式で受け取る設定）
app.use(express.json());
//ここにエンドポイントを追加していく（内容はrouterの中に記載）
app.use('/user', userRouter);
app.use('/api/transactions', transactionRouter); // transactionRouter をミドルウェアとして使用
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
app.use((err, req, res, _next) => {
    logger.error(`エラー: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
});
//テストファイルからappにインポート
export default app;
// アプリケーションがテスト環境でない場合のみサーバーを起動
if (process.env.NODE_ENV !== 'test') {
    // 環境変数 NODE_ENV が 'test' でない場合
    app.listen(port, () => {
        logger.info(`Server running on http://localhost:${port}`); // URLの重複を修正
    });
}
