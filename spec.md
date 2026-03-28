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

### profile
- 2019.3  4年生大学法学部卒業
- 2019.4  医療関連パッケージの運用保守
- 2021.10 国内向け漫画配信サイト
- 2023.1  国内向け音声配信サイト
- 2024.2  海外向け漫画配信サイト
- 2025.3  海外向け動画配信サイト

### works
- [豆腐](https://github.com/michan74/Tofu?tab=readme-ov-file)
- [雲雀文庫](https://github.com/michan74/hibari-library?tab=readme-ov-file)
- 第１回zennハッカソン [ハッシュタグ工房](https://github.com/michan74/koduck)
- 第２回zennハッカソン [Bear Horizon]()
- 第４回zennハッカソン [食事キロクマ]()

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
