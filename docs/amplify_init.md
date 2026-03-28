# Amplify セットアップ手順

## 前提条件

- [ ] AWSアカウント作成済み
- [ ] GitHubアカウント
- [ ] Node.js 18以上

## Phase 1: Amplify Hosting（Nuxt SSR デプロイ）

※ 現状の `useStorage` のままデプロイ。まずHostingの動作確認を優先。

### 1. GitHubリポジトリ準備
- [ ] GitHubにリポジトリ作成
- [ ] 現在の変更をcommit & push

### 2. Amplifyコンソールでデプロイ
- [ ] [Amplify コンソール](https://console.aws.amazon.com/amplify/) にアクセス
- [ ] 「新しいアプリを作成」→「Gitリポジトリをホスト」
- [ ] GitHubを選択 → リポジトリ・ブランチ選択
- [ ] フレームワーク自動検出（Nuxt）確認
- [ ] ビルド設定確認 → デプロイ開始

### 3. ビルド設定カスタマイズ（必要に応じて）
- [ ] `amplify.yml` 作成（デフォルトで動かない場合のみ）

### 4. 動作確認
- [ ] デプロイ完了 → 発行URLにアクセス
- [ ] クッキー演出が動くか確認
- [ ] `/api/visit` が動作するか確認

## Phase 2: Gen 2 でバックエンド追加（DynamoDB）

### 5. Amplify Gen 2 初期化
- [ ] `npm create amplify@latest` 実行（既存ディレクトリで）
- [ ] `amplify/` フォルダ生成確認

### 6. データモデル定義
- [ ] `amplify/data/resource.ts` でスキーマ定義
  - 訪問者カウント
  - クッキー情報

### 7. サンドボックスで開発
- [ ] `npx ampx sandbox` でサンドボックス起動
- [ ] `server/api/visit.post.ts` をDynamoDB対応に修正
- [ ] `server/api/cookies.get.ts` をDynamoDB対応に修正
- [ ] ローカルで動作確認

### 8. 再デプロイ
- [ ] commit & push
- [ ] Amplifyが自動でバックエンド + フロントエンド再デプロイ
- [ ] 本番環境で動作確認

## Phase 3: S3 画像ストレージ（オプション）

### 9. S3バケット設定
- [ ] `amplify/storage/resource.ts` 作成
- [ ] 画像保存用バケット定義

### 10. 画像キャッシュ移行
- [ ] `/api/image` のキャッシュをS3に変更
- [ ] テスト & デプロイ

---

## 現在のステータス

**Phase 1 作業中**

## メモ

- 現在は `useStorage` でローカルストレージ使用中
- Pollinations.ai で画像生成中（将来的にGemini事前生成に移行予定）


## ブログ

Amplifyを使ってみることにしました。
現状Dockerで開発途中だったので、まずは、Amplify Hosting を使って、Nuxtアプリケーションをデプロイし、
その後で、Amplify Gen2を使って、DBやストレージを作成していきます。

## Amplify Hosting

### 用意するもの

- githubリポジトリー

### やること

Amplifyコンソールでぽちぽちっとするだけ！

リポジトリにpushするごとにデプロイが走るようになります〜

## Amplify Gen 2
