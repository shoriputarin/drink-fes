# 文化祭ドリンク売上管理アプリ

Next.js + Vercel KV + Edge Function を使った、文化祭向けドリンク売上管理アプリの雛形です。

## 技術構成
- フロントエンド: Next.js (App Router)
- バックエンド: Next.js API Route or Edge Function
- データベース: Vercel KV (無料枠)
- デプロイ: Vercel (GitHub連携で自動デプロイ)

## ディレクトリ構成（予定）

```
/app
  /page.tsx         // 注文入力画面
  /admin/page.tsx   // 売上集計画面
  /api/order/route.ts // 注文保存API (Edge Function)
  /api/sales/route.ts // 売上取得API (Edge Function)
/lib/kv.ts          // KVクライアントラッパー
```

## 今後の実装方針
1. 注文入力画面 `/` の作成
2. 売上集計画面 `/admin` の作成
3. APIルート `/api/order`, `/api/sales` の作成
4. Vercel KV連携
5. デプロイ・動作確認

---

### セットアップ

```sh
npm install
npm run dev
```

---

ご要望に応じて、各画面やAPIの実装サンプルも追加します。
