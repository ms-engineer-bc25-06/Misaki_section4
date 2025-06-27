# 公式の Node.js LTS バージョンをベースにする
FROM node:lts

# アプリケーションの作業ディレクトリを作成・移動
WORKDIR /app

# package.json と package-lock.json を先にコピー（依存インストール効率化）
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# アプリケーションの全ファイルをコピー
COPY . .

# ポートを公開（Next.js と重ならないように 4000）
EXPOSE 4000

# 開発用コマンドを実行（ts-nodeを使って起動）
CMD ["npm", "run", "dev"]
