import express from 'express';
import cors from 'cors'; 
import morgan from 'morgan';
import winston from 'winston';

import userRouter from './router/user';

import transactionRouter from'./router/transaction';


// loggerの設定
const logger = winston.createLogger({
  level:'debug',//ログレベル（あとで.envで変えられる）
  format:winston.format.combine(
    winston.format.timestamp(),//タイムスタンプ
    winston.format.colorize(),//色付け（開発時のみ）
    //winston.format.json(),//本番ログ　JSON形式
    winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })//見やすくするため（開発時のみ）
  ),
  transports: [new winston.transports.Console()],
});

// express
const app = express();
const port = 4000;

//Next.jsアクセス許可
app.use(cors());

// morgan設定
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
app.use(morgan('combined', { stream }));

app.use(express.json());


//ミドルウェア（リクエストの内容をJSON形式で受け取る設定）
app.use(express.json());

//ここにエンドポイントを追加していく（内容はrouterの中に記載）
app.use('/user', userRouter);

app.use('/api/transactions', transactionRouter);

// http://localhost:4000(GET)にアクセスした際の処理

app.get('/', (req, res) => {
  logger.debug('GET / にアクセスされました'); // ← ここにログ追加
  res.send('Hello World!!');
});

//エラー処理
app.get('/error', (req, res, next) => {
  next(new Error('テストエラー'));
});


// 確認用
app.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}`);
});