# Node.js / npm バージョン・環境差異によるエラー記録

## 概要

AWS Amplify Gen 2 へのデプロイ時に発生した `npm ci` エラーの調査記録。
ローカル環境とAmplifyビルド環境の差異が原因で複数の問題が発生した。

## 発生したエラー

```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: fast-xml-parser@4.4.1 from lock file
npm error Missing: strnum@2.2.2 from lock file
```

## 環境の違い

### 1. CPUアーキテクチャ

| 環境 | アーキテクチャ |
|------|---------------|
| ローカルMac (Apple Silicon) | ARM64 |
| Docker (デフォルト) | ARM64 |
| AWS Amplify | x86_64 (AMD64) |

**影響**: ネイティブモジュール（`oxc-parser`など）のバイナリが異なる

**対策**: Dockerで `--platform linux/amd64` を指定
```bash
docker run --rm --platform linux/amd64 -v "$(pwd)":/app -w /app node:22-slim npm install
```

### 2. Linuxディストリビューション

| イメージ | ベース | Cライブラリ |
|---------|-------|------------|
| node:22-alpine | Alpine Linux | musl |
| node:22-slim | Debian | glibc |
| AWS Amplify (AL2023) | Amazon Linux 2023 | glibc |

**影響**: ネイティブモジュールの互換性に影響する可能性

**結果**: 今回はalpineとslimで同じpackage-lock.jsonが生成された（影響なし）

### 3. Node.jsバージョン

| バージョン | 付属npm |
|-----------|---------|
| Node 20 | npm 10.8.2 |
| Node 22 | npm 10.9.7 |
| ローカル (Node 25) | npm 11.8.0 |

**影響**:
- `rollup-plugin-visualizer@7.0.1` は Node 22以上を要求
- npmバージョンの違いでpackage-lock.jsonの解釈が異なる可能性

### 4. npm ci vs npm install

| コマンド | 動作 |
|----------|------|
| `npm ci` | package-lock.jsonを厳密に解釈。不整合があればエラー |
| `npm install` | 柔軟に依存関係を解決。不整合があっても自動修正 |

**結果**: `npm ci` で失敗、`npm install` で成功

## 試した組み合わせ

| # | Node | イメージ | プラットフォーム | Amplifyコマンド | 結果 |
|---|------|---------|-----------------|----------------|------|
| 1 | 20 | alpine | ARM64 | - | nuxt prepare失敗（ネイティブバインディングエラー） |
| 2 | 22 | alpine | ARM64 | npm ci | Missing from lock file エラー |
| 3 | 22 | alpine | AMD64 | npm ci | Missing from lock file エラー |
| 4 | 22 | slim | AMD64 | npm ci | Missing from lock file エラー |
| 5 | 22 | slim | AMD64 | npm install | **成功** |

## 最終的な構成

### Dockerfile
```dockerfile
FROM node:22-alpine
```

### amplify.yml
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 22
        - nvm use 22
        - npm install  # npm ci ではなく npm install を使用
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .output/public
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .nuxt/**/*
```

### ローカルでのpackage-lock.json生成
```bash
# AMD64 + Debian環境で生成（Amplifyに近い環境）
docker run --rm --platform linux/amd64 -v "$(pwd)":/app -w /app node:22-slim npm install
```

## 未解決の疑問

1. **なぜ同じnpmバージョン（10.9.7）でnpm installして生成したpackage-lock.jsonが、npm ciで失敗したのか？**
   - 仮説: Amplifyのnode_modulesキャッシュが古い状態と新しいpackage-lock.jsonで不整合を起こした可能性

2. **alpineとslimで同じpackage-lock.jsonが生成されたのに、なぜエラーが出たのか？**
   - package-lock.jsonの内容は同じでも、Amplify側の環境との組み合わせで問題が発生した可能性

## 今後の実験案

1. Amplifyのキャッシュを無効にして `npm ci` を試す
2. Amplifyビルド時のnpmバージョンをログ出力して確認
3. package-lock.jsonのlockfileVersionを確認・比較

## 参考リンク

- [npm ci ドキュメント](https://docs.npmjs.com/cli/v10/commands/npm-ci)
- [npmのoptional dependenciesバグ #4828](https://github.com/npm/cli/issues/4828)
- [AWS Amplify Node.js バージョンサポート](https://docs.aws.amazon.com/amplify/latest/userguide/troubleshooting-general.html)
