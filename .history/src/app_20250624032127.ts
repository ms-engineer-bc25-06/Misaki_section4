import express from 'express';

import userRouter from './router/user';

// express
const app = express();
const port = 4000;

//ここにエンドポイントを追加していく（内容はrouterの中に記載）
app.use('/user', userRouter);

// http://localhost:4000(GET)にアクセスした際の処理
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 確認用
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});