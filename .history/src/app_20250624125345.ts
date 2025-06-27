import express from 'express';

import userRouter from './router/user';

import transactionRouter from'./router/transaction';
// express
const app = express();
const port = 4000;

//ミドルウェア（リクエストの内容をJSON形式で受け取る設定）
app.use(express.json());

//ここにエンドポイントを追加していく（内容はrouterの中に記載）
app.use('/user', userRouter);
app.use('/api/transactions',transactionRouter);

// http://localhost:4000(GET)にアクセスした際の処理
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 確認用
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});