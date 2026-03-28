Nuxtで作成したサイトをサクッとデプロイしたいな〜と思って調べていたら、AWS Amplifyというサービスが出てきました。
どういうものか、どうやって使うのかをまとめておきます。

## 今回作成する予定のもの

以下のような構成の予定です。これらをどうデプロイするかを考えていました。

- フロントエンド
  - Nuxt(ssr)

- バックエンド
  - AWS Lambda
  - DynamoDB
  - S3

- 開発環境: Docker

## AWS Amplifyとは？？？

AWS Amplifyは、webサービスの構築できる機能を提供しています。
[フルスタック開発 - ウェブおよびモバイルアプリ - AWS Amplify](https://aws.amazon.com/jp/amplify/?nc=sn&loc=1)　

なんでも屋さん？？？


今回は、特にAmplify Hosting, Amplify Gen 2 が候補に上がったので、調べました。

## Amplify Hosting

その名の通りホスティングのサービス。
Vue, Reactなどのフレームワークで実装されたフロントエンドアプリケーションを、git接続するだけでそのままデプロイできる。
VercelのAWS版だと思っている。

 今回作成予定のnuxt SSRアプリをデプロイすると、内部的に以下が自動作成されます:
  - CloudFront (CDN)
  - Lambda@Edge (SSR実行)
  - S3 (静的アセット)

  参考: [SSR supported features - AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-supported-features.html)

## Amplify Gen 2

TypeScriptでフロントエンド/バックエンド/インフラのフルスタック開発を行えるサービス。(Amplify Hosting機能も含む)

Amplify Gen 2
  ├── Hosting（フロントエンド）← Amplify Hosting
  └── Backend（Lambda, DynamoDB, S3など）

- [フルスタック TypeScript 開発環境 AWS Amplify Gen 2 をグラレコで解説 - builders.flash☆ - 変化を求めるデベロッパーを応援するウェブマガジン | AWS](https://aws.amazon.com/jp/builders-flash/202411/awsgeek-aws-amplify-gen2/)
- [Concepts - AWS Amplify Gen 2 Documentation](https://docs.amplify.aws/vue/how-amplify-works/concepts/)

以下、自分的に良さそうだなと思ったことです。

### インフラのコード管理

まず、TypeScript を使ってインフラをコード管理することができます。
以下のような仕組み。
```
TypeScriptで定義 → Amplify Gen 2 → CDK → CloudFormation → AWSリソース作成
```

例えば、webサービスで利用するDBやストレージサービスの設定を、TypeScriptでパパッとできてしまいます。
- Amplifyがない場合
  コンソールぽちぽちするまたは、CDK等で設定が必要になります。
  - DynamoDBでテーブル作成
  - S3のBucket作成
  - などなど

- Amplifyがある場合
  TypeScriptで簡単にリソース定義することができます。
  注意) AIに作成してもらったコードのイメージのため、実際に動くものかは不明です。
  ```
  // amplify/data/resource.ts
  import { defineData } from '@aws-amplify/backend';
  
  export const data = defineData({
    schema: /* GraphQL */ `
      type Cookie @model {
        id: ID!
        imageUrl: String!
        createdAt: AWSDateTime!
      }
    `
  });
  ```
  AWSリソース作成でコンソールぽちぽちや、複雑なCDKでの設定など不要なのは助かります！
  (CDK を利用する方が、細かく設定できる。簡単に設定できるのが、Amplify！)

### フロントエンド/バックエンドを簡単にデプロイ！

今回で言うとnuxtとlambdaのコードデプロイが必要ですが、どちらもgit pushでそのままデプロイすることができます。
また、データモデル、GraphQL スキーマ、認証ロジックなどを TypeScript で宣言的に定義すると、対応する AWS リソースの自動生成も可能のようです。
(何でもできすぎて、よくわからん)

### 全部見れるコンソール

Amplifyコンソールで、フロントエンド・バックエンド両方の状態を一元管理できます。
- デプロイ状況
- ビルドログ
- 環境変数
- ドメイン設定

Lambda、DynamoDB、S3を個別にAWSコンソールで確認する必要がなく便利です。

### その他機能

Amplify UIというUIコンポーネントの提供やクラウドサンドボックス環境の作成などもできるようです。
使いこなせるかわかりませんが、機会があれば使ってみたいです。

## 料金

**Amplify Hosting料金（ビルド時間、ストレージ、データ転送）+ 各AWSリソースの料金**

各サービスに無料枠があるため、小規模サイトなら実質無料で運用可能。


## まとめ

- AWS Amplify 便利そう。便利すぎて何もわからない。それでいいのかもしれない。
- 次回: 使ってみた編
