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

- 1. Amplifyコンソールでアプリ作成
Amplifyコンソールでぽちぽちっとするだけ！


リポジトリにpushするごとにデプロイが走るようになります〜

## Amplify Gen 2

### やること

1. Amplify初期化
  ```
  npx ampx init
  ```
  ルートに`/amplify`フォルダ(Gen2の土台)が作成されます。
  リポジトリ内の Gen2用の構成（amplify/ + amplify.yaml）を検出して、Gen 2 としてデプロイ/アプリ作成が可能になります。

2. バックエンドリソース定義の追加(DBの作成準備)
  TypeScriptでDBのスキーマや認証方法を定義します。(CDKでインフラ定義するようなイメージ)
  ```ts:resource.ts
  import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

  const schema = a.schema({
    // 訪問者カウント（シングルトン的に使用）
    VisitorCount: a
      .model({
        count: a.integer().required(),
      })
      .authorization((allow) => [allow.publicApiKey()]),
  });
  
  export type Schema = ClientSchema<typeof schema>;
  
  export const data = defineData({
    schema,
    authorizationModes: {
      defaultAuthorizationMode: 'apiKey',
      apiKeyAuthorizationMode: {
        expiresInDays: 365,
      },
    },
  });
  ```

3. amplify.ymlを作成
バックエンドとフロントエンドそれぞれのbuildコマンドなどを設定します。

```yaml:amplify.yaml
version: 1
backend:
  phases:
    build:
      commands:
        - nvm install 22
        - nvm use 22
        - npm install
        - npx ampx pipeline-deploy --branch $AWS_BRANCH --app-id $AWS_APP_ID
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 22
        - nvm use 22
        - npm install
    build:
      commands:
        - npx ampx generate outputs --app-id $AWS_APP_ID --branch $AWS_BRANCH --out-dir . ## amplify_outputs.jsonの取得
        - npm run build
  artifacts:
    baseDirectory: .output/public
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .nuxt/**/*
```
＊ ↑本当はインストールするnpmパッケージ安定させるために、`npm ci`を使うべきなのですが、ローカル環境(Mac Docker)とAmplifyサーバー上の環境の差分で、うまくいかなかったので、`npm install`にしています。

git pushした際に、amplify.yamlに従って、buildをしてくれます。
```md:イメージ図
git push
   ↓
Amplify Hosting
   ↓
amplify.yaml 実行
   ↓
npx ampx pipeline-deploy ← ここでバックエンド更新
   ↓
npx ampx generate outputs ← デプロイされたバックエンドの接続情報（amplify_outputs.json）を取得
   ↓
npm run build
```

4. Amplifyコンソールでアプリ作成
  Amplify Hostingと同じ流れでAWSコンソール上でぽちぽちします。

  [[画像]]

  するとgit pushでバックエンドもフロントエンドもデプロイされるようになります。

## ポイント
### DB定義をするだけでAppSync GraphQL APIも作成してくれる

初めはバックエンドAPIを自分で実装して、そこからDB接続するように実装していたのですが、自分でバックエンドAPIを実装する必要がありませんでした！
resource.tsにDB定義するだけで、すぐにフロントエンドから使える状態になっているのはとても便利でした。
```md:イメージ図
[resource.ts]
    ↓
Amplify Gen2
    ↓
┌──────────────────┐
│ AppSync API      │ ← ★これも作成してくれる
│  - query         │
│  - mutation      │
│  - resolver      │
└──────────────────┘
      ↓
┌──────────────────┐
│ DynamoDB         │ ← DB
└──────────────────┘
```

### バックエンドリソースの接続情報の設定が簡単

こちらも当初は認識しておらず、AppSyncAPIの接続先URLやAPIキーをデプロイ結果から取得して、環境変数経由で設定していました。
そんな面倒なことも必要ありません！

- before
デプロイしたバックエンドリソースの接続情報などを、amplify_outputs.jsonから読み込んで、環境変数を設定していた。
```yaml:amplify.yaml
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 22
        - nvm use 22
        - npm install
    build:
      commands:
        - export APPSYNC_URL=$(node -e "console.log(require('./amplify_outputs.json').data.url)")
        - export APPSYNC_API_KEY=$(node -e "console.log(require('./amplify_outputs.json').data.api_key)")
```

-　after
`Amplify.configure(outputs);`だけ。nuxtのpluginとして追加しました。
```
import { Amplify } from "aws-amplify";
import outputs from "~/amplify_outputs.json";

export default defineNuxtPlugin(() => {
  Amplify.configure(outputs);
});
```

### サンドボックス作成も簡単

DB作成した際に、ローカル環境から接続して動作確認したいなと思った時に、簡単にサンドボックス環境を立ち上げることができます。
以下コマンドで簡単にクラウド上にリソースができます。
```
npx ampx sandbox
```
＊サンドボックスは自動停止されないため、不要になったら削除しましょう。
＊AWSのアクセスキーと適切なIAMポリシーが必要になります。以下ポリシーが付与されていればOKでした。
  - AmplifyBackendDeployFullAccess
  - AmazonS3FullAccess
  - CloudFormationFullAccess
＊サンドボックス作成時に、cdk bootstrapでエラーとなりました。必要な場合は、CDK環境のbootstrapを実行しましょう。
- [Troubleshoot CDKToolkit stack issues - Swift - AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/swift/build-a-backend/troubleshooting/cdktoolkit-stack/#error-bootstrapping-account)
- CDKでデプロイするための準備
  - AWS側に必要なリソースが作成される
    - CloudFormation、S3などなど
  - 1アカウント内の1リージョンで1回実行すればOK。既に他プロジェクトなどで実行済みの場合は不要な作業。


## まとめ

バックエンドも含め簡単にデプロイできて便利でした。
詳しい知識がなくても、AIを使えば簡単にできました！
