# ToDo RPG

AIメンター付きToDo/RPGアプリのひな型です。`agent.md`の仕様とIssueテンプレートを基に、初期設計とバックログの種を用意しています。

## What’s here
- `agent.md`: 目標分解・自動ToDo生成・EXP/モチベ仕様
- `docs/app-template.md`: アーキテクチャ/データモデル/画面構成の青写真
- `docs/backlog-seed.md`: Issueテンプレートに貼れるバックログ草案
- `.github/ISSUE_TEMPLATE/main-template.md`: 課題作成フォーマット

## How to start building
1. Flutter環境を用意し、`flutter create .` または別ディレクトリでプロジェクトを作成。
2. `docs/app-template.md`の構成に沿って`lib/features/*`と`functions/`を作成。
3. Firebaseプロジェクトを作成し、Auth/Firestore/FCM/Functionsを接続（`docs/backlog-seed.md`の`firebase-integration`を参照）。
4. 機能ごとにIssueを切って進行（`docs/backlog-seed.md`をコピーし、Issueテンプレで整形）。

## Notes
- 毎朝07:00（ユーザー設定可）にCloud FunctionでToDoを生成し、難易度/EXP/モチベを更新する想定です。
- ガチャ要素や部屋デコなどの拡張は、`gamification`エリアのIssueとして段階的に追加してください。
