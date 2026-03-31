# ポートフォリオサイト

## アーキテクチャ

```mermaid
flowchart TB
    subgraph Client[クライアント]
        Browser[ブラウザ]
    end

    subgraph Amplify[AWS Amplify Gen 2]
        subgraph Hosting[Hosting]
            CF[CloudFront]
            Lambda[Lambda@Edge]
            S3Static[S3 静的ファイル]
        end

        subgraph Nuxt[Nuxt 4 SSR]
            Pages[Pages]
            API[server/api/]
        end

        subgraph Backend[Backend]
            S3Images[S3 クッキー画像]
            DynamoDB[(DynamoDB 訪問者カウント)]
        end
    end

    Browser --> CF
    CF --> Lambda
    Lambda --> Nuxt
    Pages --> API
    API --> DynamoDB
    Pages -.-> S3Images

    subgraph External[外部 事前準備]
        Gemini[Gemini API]
    end

    Gemini -.->|事前生成| S3Images
```

### 構成
- **Hosting（Amplify管理）**
  - Nuxt 4 (SSR)
  - 内部: CloudFront + Lambda@Edge + S3
  - 参考: [AWS公式](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html)
- **Backend**
  - S3（クッキー画像保存）
  - DynamoDB（訪問者カウント）
- **Nuxt Server API**
  - `server/api/` でDB操作（フロントから直接DBアクセスしない）

### 外部API
- Gemini API（クッキー画像の事前生成用 ※ビルド時のみ）

## コンテンツ管理

- YAMLで管理（更新しやすさ重視）

## 内容

### icon

- kuma.png

### profile
- dorayaki
- webエンジニア(2021.10~)
- くまになりたい

- twitter: https://x.com/SPuemi
- zenn: https://zenn.dev/michan74

### works
- Tofu
  - とうふ✖️じゃんけんゲーム
  - 非公開
  - /works/tofu.png

- 雲雀文庫
  - 色で本を共有する
  - [雲雀文庫](https://github.com/michan74/hibari-library?tab=readme-ov-file)
  - no image 

- ハッシュタグ工房
  - SNSに投稿する画像からハッシュタグを生成
  - [第１回zennハッカソン 提出作品](https://zenn.dev/michan74/articles/b442ee4115c7e5)
  - hashtag.png

- Bear Horizon
  - くまの気持ちで英単語を学ぶ
  - [第２回zennハッカソン 提出作品](https://zenn.dev/michan74/articles/36ef1b41d64590)
  - bear_horizon.png

- 食事キロクマ
  - くまを育てて食事を記録する
  - [第４回zennハッカソン 提出作品](https://zenn.dev/michan74/articles/65a0ecc47c9d7f)
  - kirokuma.png

## デザイン

- icon profile　中央




## 機能

### クッキー演出
- 10種類のクッキー画像（Geminiで事前生成）
- 訪問時にランダムで選んで降らせる
- **降るクッキーの数 = 累計訪問者数**
  - 例: 10人目の訪問者には10個のクッキーが降る
  - 上限の検討が必要

### 訪問者カウント
- DynamoDBで累計訪問者数を管理

## コンセプト

- お菓子作り
- お絵描き
- ガラス

※デザインの詳細は後で決定
