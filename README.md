# 読書本記録Webアプリ

読んだ本を記録・管理するWebアプリです

## 使用した技術
- HTML / CSS
- Node.js
- Express
- SQLite(better-sqlite3)
- EJS

## 機能
- 本の追加
- 本の一覧表示
- 本のタイトル修正
- 本の削除（間違って追加してしまったとき）
- タイトル重複チェック
- 空白（スペースのみも含む）入力チェック
## 公開URL
https://project01-tx84.onrender.com
> 無料プランのため、しばらくアクセスがない場合は起動に30秒〜1分かかることがあります。

## ローカルでの起動方法

### 事前準備
以下の2つをインストールしてください。

- [Node.js](https://nodejs.org) ← LTS版を推奨
- < node js が入っていない方
- 
- [Git](https://git-scm.com)

### 起動手順

> ※ コマンドプロンプト(CMD) または Git Bash で実行してください。
```bash
git clone https://github.com/Yasuhidelto/project01.git
cd project01
npm install
node server.js
```
ブラウザで http://localhost:3000 にアクセス


