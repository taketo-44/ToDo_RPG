# ToDo RPG

AIメンター付きToDo/RPGアプリのひな型です。`agent.md`の仕様とIssueテンプレートを基に、初期設計とバックログの種を用意しています。PythonスタックでWeb/PWAを組む前提（例: FastAPI + PyScript/HTMX）で書き換えています。

## 📋 概要 / Overview

### What's here
- `agent.md`: 目標分解・自動ToDo生成・EXP/モチベ仕様
- `docs/app-template.md`: Python製Web/PWA向けアーキテクチャ/データモデル/画面構成の青写真
- `docs/backlog-seed.md`: Issueテンプレートに貼れるバックログ草案
- `.github/ISSUE_TEMPLATE/main-template.md`: 課題作成フォーマット

### Features
- 📱 **PWA Support**: スマートフォンにネイティブアプリとしてインストール可能
- 🎮 **Gamification**: タスク完了でEXPを獲得し、レベルアップ
- 🤖 **AI Tutor**: 目標を自動分解し、タスクを生成
- 🔔 **Notifications**: タスクリマインダーのためのWeb Push通知
- 📊 **Firestore Database**: クラウドベースのデータストレージと同期

---

## 🚀 クイックスタート / Quick Start

### 必要要件 / Prerequisites

- **Python 3.11+**
- **pip** (Pythonパッケージマネージャー)
- **Firebaseプロジェクト** (認証・データベース用)
- モダンなWebブラウザ

### インストール・セットアップ / Installation & Setup

#### 1. Python仮想環境を作成

```bash
# プロジェクトルートに移動
cd /path/to/ToDo_RPG

# 仮想環境を作成
python -m venv .venv

# 仮想環境を有効化
# Linux/macOS:
source .venv/bin/activate
# Windows:
# .venv\Scripts\activate
```

#### 2. 依存ライブラリをインストール

```bash
# backendディレクトリに移動
cd backend

# 必要なPythonパッケージをインストール
pip install -r requirements.txt
```

**依存パッケージ:**
- `fastapi`: Webフレームワーク
- `uvicorn`: ASGIサーバー
- `firebase-admin`: Firebase SDK
- `pydantic`: データ検証
- `openai`: AI Tutorの実装
- `python-dotenv`: 環境変数管理

#### 3. 環境変数を設定

`backend/`ディレクトリに `.env` ファイルを作成し、Firebaseの認証情報を設定します：

```bash
# backend/.env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
OPENAI_API_KEY=your_openai_api_key
```

**Firebase認証情報の取得方法：**
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新規プロジェクト作成または既存プロジェクトを選択
3. プロジェクト設定 → サービスアカウント に移動
4. 新しい秘密鍵を生成
5. ダウンロードしたJSONファイルから値をコピー

### アプリケーション実行 / Running the Application

#### バックエンドサーバーを起動

```bash
# backendディレクトリから実行（.venvが有効化されていることを確認）
cd backend

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

バックエンドサーバーは以下のURLで起動します: **http://localhost:8000**

#### アプリケーションにアクセス

1. Webブラウザを開く
2. **http://localhost:8000** にアクセス
3. ToDo RPGアプリケーションのUIが表示されます

### 利用可能なAPI エンドポイント

- **Health Check**: `GET http://localhost:8000/health`
- **Goals**: `/api/goals/` (`backend/app/routers/goals.py`に定義)
- **Tasks**: `/api/tasks/` (`backend/app/routers/tasks.py`に定義)

---

## 📁 プロジェクト構成 / Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI アプリケーション設定
│   ├── models/              # データモデル
│   │   └── task.py
│   └── routers/             # APIエンドポイント
│       ├── goals.py
│       └── tasks.py
├── services/                # ビジネスロジック層
│   ├── firestore.py         # Firebase連携
│   └── tutor.py             # AI Tutor実装
└── requirements.txt         # Python依存パッケージ

web/
├── index.html               # メインアプリケーションページ
├── style.css               # カスタムスタイル
├── manifest.json           # PWA設定
├── sw.js                   # Service Worker
└── js/                     # フロントエンドJavaScript
    └── wizard.js

docs/
├── app-template.md         # アーキテクチャドキュメント
└── backlog-seed.md         # 機能バックログテンプレート
```

---

## 🛠️ 開発ガイド / Development Guide

### How to start building

1. Python 3.11+ を用意し、仮想環境を作成（例: `python -m venv .venv && source .venv/bin/activate`）。
2. `docs/app-template.md`の構成に沿って`backend/`（FastAPI）と`web/`（PyScript + HTMX + Tailwind等）を作成。PWA用の`manifest.webmanifest`とService Workerも置く。
3. Firebaseプロジェクトを作成し、Auth/Firestore/FCMをPython SDKで接続。環境変数は`.env`に格納し、バックエンドとPyScript双方で使う公開キーは`VITE_`/`NEXT_PUBLIC_`ではなく`data-`属性やJSONエンドポイント経由で供給する。
4. 機能ごとにIssueを切って進行（`docs/backlog-seed.md`をコピーし、Issueテンプレで整形）。

### 開発時のヒント

- **ホットリロード**: `--reload` フラグでコード変更時に自動再起動
- **CORS設定**: 開発環境ではすべてのオリジンを許可
- **静的ファイル**: `web/` ディレクトリからWebフロントエンドを提供
- **データベース**: Firestore Databaseを使用して永続化

---

## ⚠️ トラブルシューティング / Troubleshooting

### ポート 8000 が既に使用中の場合

```bash
# 異なるポートを使用
uvicorn app.main:app --reload --port 8001
```

### モジュールが見つからないエラー

```bash
# 仮想環境が有効化されていることを確認
source .venv/bin/activate

# 依存パッケージを再インストール
pip install -r requirements.txt

# backendディレクトリから起動する場合
cd backend
uvicorn app.main:app --reload
```

### Firebase接続エラー

- `.env` ファイルの認証情報が正しいか確認
- Firebaseプロジェクトで Firestore Database が有効か確認
- サービスアカウントの権限が正しく設定されているか確認

---

## 📝 設計方針 / Architecture Notes

- 毎朝07:00（ユーザー設定可）にCloud FunctionでToDoを生成し、難易度/EXP/モチベを更新する想定です。タイムゾーンはWeb側で設定した値を参照します。
- Web Push通知とPWAインストールを前提にしていますが、通知拒否時はメール/オンサイトメッセージにフォールバックする設計にすると安全です。Web PushはFCMまたは`pywebpush`でVAPID署名。
- ガチャ要素や部屋デコなどの拡張は、`gamification`エリアのIssueとして段階的に追加してください。

---

## 🔗 参考資料 / Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Firebase Python SDK](https://firebase.google.com/docs/firestore/client/start-with-python)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [HTMX Documentation](https://htmx.org/)

---

## 📞 次のステップ / Next Steps

1. `docs/app-template.md` でアーキテクチャの詳細を確認
2. `docs/backlog-seed.md` で機能ロードマップを確認
3. `backend/app/routers/` でAPIエンドポイントを探索
4. `web/` ディレクトリでWebフロントエンドをカスタマイズ
