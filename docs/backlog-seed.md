# Backlog Seeds (copy into GitHub Issues)

Use `.github/ISSUE_TEMPLATE/main-template.md` and paste the blocks below. Adjust AC/estimates per sprint.

---
### [goal-processing] 初回目標登録UI — ゴール入力と時間設定
Description: 目的/背景 → agent.mdのゴール分解とデータ収集に対応。初回起動で長期目標・現在値・期限・平日/休日の時間を入力し、通知許可を取得する。
Acceptance Criteria (AC):
- [ ] 長期目標/現在値/期限/平日・休日の時間を入力できる
- [ ] 入力をFirestore `goals` に保存し、ユーザーのpreferredDailyTimeを設定
- [ ] 通知許可の結果を記録し、次回起動でスキップできる
Tasks:
- [ ] 画面UI + バリデーション
- [ ] Firestore書き込み
- [ ] 通知許可ハンドリング
Labels: type:feature, area:goal-processing, prio:M
Milestone: M1
Estimate: M

---
### [todo-generation] 07:00 自動ToDo生成 Cloud Function
Description: 目的/背景 → 毎朝7時にAIでToDoを生成する。ユーザー設定の時刻・タイムゾーンを考慮し、難易度とEXPを付与して`tasks`に保存。
Acceptance Criteria (AC):
- [ ] スケジュールされたFunctionがユーザー設定のローカル時刻で動作
- [ ] AI呼び出しエラー時は前日の難易度を流用しつつ再試行/フォールバック
- [ ] 作成タスクにdifficulty/expが付与され、重複生成を防止
Tasks:
- [ ] Cloud Scheduler/Function実装
- [ ] AIプロンプト・フォールバック実装
- [ ] Firestore書き込みと重複チェック
Labels: type:feature, area:todo-generation, prio:H
Milestone: M1
Estimate: L

---
### [gamification] EXP/レベル計算と報酬UI
Description: 目的/背景 → ToDo完了でEXPを付与し、レベルアップ・装備/部屋デコ解放を表示する。
Acceptance Criteria (AC):
- [ ] 難易度に応じたEXPが加算され、DBのユーザー進捗に反映
- [ ] レベルアップ時にモーダル/トーストで通知
- [ ] 装備/部屋デコの解放条件が表示され、状態が保存される
Tasks:
- [ ] EXP/レベル計算ロジック
- [ ] Firestore更新 + ローカルキャッシュ
- [ ] UI（EXPバー、報酬一覧、解放モーダル）
Labels: type:feature, area:gamification, prio:M
Milestone: M2
Estimate: M

---
### [motivation] ストリーク＆応援メッセージ
Description: 目的/背景 → 連続達成を可視化し、応援メッセージを送る。完了率に応じて難易度を自動調整。
Acceptance Criteria (AC):
- [ ] ストリーク日数を表示し、一定日数でボーナス付与
- [ ] 完了率に応じて難易度を上げ下げする（agent.mdのルール参照）
- [ ] 失敗が続く場合に軽めの「小さな勝利」タスクを提案
Tasks:
- [ ] ストリーク判定 + EXPボーナス
- [ ] 難易度調整ロジック
- [ ] メッセージ配信（UI or 通知）
Labels: type:feature, area:motivation, prio:M
Milestone: M2
Estimate: M

---
### [ui-ux] Today画面 & クイック完了フロー
Description: 目的/背景 → 日常操作の摩擦を最小化。ToDo一覧、難易度バッジ、EXPプレビュー、スワイプ完了/スキップを提供する。
Acceptance Criteria (AC):
- [ ] Today画面に当日の自動生成タスクと手動追加タスクが並ぶ
- [ ] 完了/スキップ/詳細へのショートカットが1タップ/スワイプで操作できる
- [ ] 空状態とローディング時のプレースホルダーがある
Tasks:
- [ ] UIコンポーネント & ステート管理
- [ ] 手動タスク追加入力
- [ ] テレメトリ（完了/スキップイベント）
Labels: type:feature, area:ui-ux, prio:H
Milestone: M1
Estimate: M

---
### [firebase-integration] Firestore/FCM/Env セットアップ
Description: 目的/背景 → Firebaseプロジェクト接続。Auth/Firestore/FCM/Remote Config/環境変数を安全に扱う。
Acceptance Criteria (AC):
- [ ] 環境変数/SecretsにFirebaseとAIキーを格納（ローカル&CIの手順あり）
- [ ] Auth/Firestore/FCM SDKが動作し、サンプル読み書きが成功
- [ ] functions/ でローカルエミュレーター実行手順がREADMEに追記
Tasks:
- [ ] Firebaseプロジェクト作成 & config投入
- [ ] Flutter SDK接続確認
- [ ] Functionsエミュレーターとデプロイ手順
Labels: type:feature, area:firebase-integration, prio:H
Milestone: M0
Estimate: M
