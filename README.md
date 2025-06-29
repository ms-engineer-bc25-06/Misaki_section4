# kakeibo_api

家計簿アプリ用のExpress APIサーバーです。

## Express の API サーバを起動
```bash
npm run dev
```

## 必要な環境変数を `.env` に設定
```env
DATABASE_URL="mysql://root:password@localhost:3306/kakeibo"
```
## Docker コンテナ起動（MySQL）
docker-compose up -d

## API 一覧（API Routes）

| メソッド | パス                  | 説明         |
|----------|-----------------------|--------------|
| GET      | /api/transactions     | 一覧取得     |
| GET      | /api/transactions/:id | 詳細取得     |
| POST     | /api/transactions     | 新規作成     |
| PUT      | /api/transactions/:id | 編集         |
| DELETE   | /api/transactions/:id | 削除         |

## github
```
 git add .
```
```
git commit -m " "
```
```
git push
```

## DBのマイグレーション
```
npx prisma migrate status
```
http://localhost:5555

