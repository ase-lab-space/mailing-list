# Mailing List

このリポジトリはメーリングリストを管理するためのプロジェクトです。

## メーリングリストの更新手順

メーリングリストを更新したい場合は、以下の手順に従ってください。

1. `src/map.ts` ファイルを編集します
2. 変更内容をコミットします
3. プルリクエスト（PR）を作成します
4. レビュー・承認後、マージされます
5. マージ後、自動で本番環境に反映・デプロイされます

## map.ts の編集方法

`src/map.ts` は、メーリングリストの転送先を定義するファイルです。

### ファイルの構造

```typescript
export const forwardingEmailMap: ForwardingEmailMap = {
	'メーリングリスト@ase-lab.space': [
		'転送先1@example.com',
		'転送先2@example.com',
		'転送先3@example.com',
	],
};
```

### 編集例

#### メンバーを追加する場合
既存のメーリングリストに新しいメールアドレスを追加します：

```typescript
'office@ase-lab.space': [
	'existing1@gmail.com',
	'existing2@gmail.com',
	'new-member@gmail.com', // 新しいメンバーを追加
],
```

#### メンバーを削除する場合
不要なメールアドレスの行を削除します。

#### 新しいメーリングリストグループを追加する場合
新しいエントリを追加します（管理者への連絡も必要です）：

```typescript
export const forwardingEmailMap: ForwardingEmailMap = {
	'office@ase-lab.space': [...],
	'newgroup@ase-lab.space': [ // 新しいグループ
		'member1@gmail.com',
		'member2@gmail.com',
	],
};
```

### 重要な注意事項

- **転送先のメールアドレスに `@ase-lab.space` のドメインは使用できません**
- 個人のメールアドレス（Gmail、Yahoo!メールなど）を指定してください
- メールアドレスの記述ミスに注意してください（誤ったアドレスにメールが転送されます）

### 注意事項

- 変更前に必ず最新の `main` ブランチから作業ブランチを作成してください
- メールアドレスや設定内容に誤りがないか、慎重に確認してください
- **新たなメーリングリストグループ (xxx@ase-lab.space) を追加する場合は、Cloudflare の管理画面での作業が必要になります。管理者までお伝えください。**
