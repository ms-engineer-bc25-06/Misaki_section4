# 📘 API 設計書
家計簿アプリにおける入出金記録を管理するために提供されます。入出金データの取得・登録・更新・削除を行います。


##  提供リソース一覧

`transactions` - 入出金記録

### エンドポイント一覧
---
## `/api/transactions`

- **GET** : 一覧を取得  
- **POST** : 新規作成

## `/api/transactions/:id`

- **GET** : 詳細取得  
- **PUT** : 更新  
- **DELETE** : 削除


##  各エンドポイント詳細
### GET `/api/transactions`

- 説明: 入出金の一覧を取得します
- リクエスト: なし
- レスポンス例:
---
```json
[
  {
    "id": 1,
    "date": "2025-06-01",
    "type": "expense",
    "category": "食費",
    "amount": -1500,
    "note": "スーパー"
  }
]
```


### POST `/api/transactions`
- 説明: 新しい入出金データを登録します
- リクエスト例:
```json
{
  "date": "2025-06-02",
  "type": "income",
  "category": "給料",
  "amount": 250000,
  "note": "5月分"
}
```
- レスポンス例:
```json
[
  {
    "id": 2,
    "date": "2025-06-02",
    "type": "income",
    "category": "給料",
    "amount": 250000,
    "note": "５月分"
  }
]
```
### PUT `/api/transactions/:id`
- 説明: 指定IDの入出金データを更新します
- リクエスト例:
```json
{
  "date": "2025-06-01",
  "type": "expense",
  "category": "食費",
  "amount": -4000,
  "note": 
}
```
- レスポンス例:
```json
{
  "id": 1,
  "date": "2025-06-01",
  "type": "expense",
  "category": "外食",
  "amount": -4000,
  "note":
}
```

### DELETE `/api/transactions/:id`
- 説明: 指定IDの入出金データを削除します
- レスポンス例:
```json
{
  "message": "Deleted successfully"
}
```
