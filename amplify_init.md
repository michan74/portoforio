# Amplify Client 移行計画

## 現状

- `server/api/visit.post.ts` で生のfetchを使ってAppSync GraphQL APIを呼び出し
- 環境変数（`appsyncUrl`, `appsyncApiKey`）で認証情報を管理
- 手動でGraphQLクエリを記述

## 移行後

Amplify Gen2の `generateClient()` を使用して、型安全かつシンプルなAPI呼び出しに変更

### 使用例

```typescript
import { generateClient } from 'aws-amplify/api'

const client = generateClient()

// データ取得
const { data } = await client.models.VisitorCount.get({ id: 'main' })

// データ更新
await client.models.VisitorCount.update({ id: 'main', count: newCount })
```

## 採用方針: Option A（クライアントサイド）

- `CookieBackground.vue`でAmplify Clientを直接使用
- サーバーAPI（`/api/visit`）を経由せず、ブラウザから直接AppSyncに接続
- AppSync自体がAPIサーバーなので、Nuxtサーバーを挟む必要なし

---

## タスク

- [x] 方針を決定 → Option A
- [x] Amplify ClientのcomposableでgenerateClientを設定
- [x] CookieBackground.vueをAmplify Client APIに置き換え
- [x] server/api/visit.post.tsを削除
- [x] 環境変数（appsyncUrl, appsyncApiKey）を削除
- [x] 動作確認
