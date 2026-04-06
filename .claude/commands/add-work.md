worksに新しい作品を追加してください。

以下の手順で進めてください：

1. ユーザーに以下を確認する：
   - 作品名（name）
   - 説明文（description）
   - URL（なければ null）
   - 画像ファイル（あれば提供してもらう）

2. `app/content/works.yaml` に以下の形式でエントリを追記する：
   ```yaml
   - name: 作品名
     description: 説明文
     url: URL または null
     image: /works/ファイル名.png または null
   ```

3. 画像がある場合は `public/works/` にコピーする

4. 変更をコミット＆pushする（コミットメッセージ例：「worksに〇〇を追加」）

$ARGUMENTS
