# ToDo RPG App Template (Python Web/PWA)

This starter blueprint is based on `agent.md` and the issue template. It captures the core loops, tech stack, and file layout you can flesh out with real code for a Python-first web/PWA (e.g., FastAPI + PyScript/HTMX).

## Product Goals
- Help users define long-term goals and break them into mid/short-term tasks.
- Auto-generate balanced daily ToDos at a set time (default 07:00).
- Assign difficulty → award EXP for completions; drive levels, outfits/equipment, and room decoration.
- Keep motivation high with streaks, small wins, and adaptive difficulty.

## Core User Flows
1. **Onboarding (Web wizard)**: Capture goal, baseline, daily time budget, deadline, time zone, notification preferences. If未ログイン, stash in localStorage/IndexedDB until sign-in completes.
2. **Daily generation (07:00 default)**: Scheduler (Cloud Scheduler/cron) hits FastAPI to call AI goal decomposition → stores daily tasks with difficulty/EXP; Web Push (or email fallback) notifies user.
3. **Task execution**: User completes ToDos on the Today dashboard, gains EXP, progresses level/equipment/room state.
4. **Adjustment loop**: Completion data tunes future difficulty and workload; sends encouragement and “small win” suggestions.

## Architecture (suggested)
- **Client**: Web/PWA with PyScript + HTMX (Python-in-browser) and Tailwind (or DaisyUI).
  - Screens: onboarding wizard, Today dashboard, calendar/history, rewards (level/equipment/room), settings.
  - State: lightweight server state via HTMX; client-side cache/drafts in localStorage/IndexedDB; PyScript modules for EXP/difficulty calculations that can run offline.
  - PWA: service worker for asset/API caching; install prompt; background sync optional.
- **Backend**: FastAPI (Python).
  - Auth: Firebase Auth session cookies or OAuth via FastAPI; anonymous→リンクも可。
  - Data: Firestore (`users`, `goals`, `tasks`, `progress`, `loadouts`, `rooms`).
  - Messaging: Web Push via FCM or VAPID (`pywebpush`); email fallback.
  - Config: `.env` loaded by FastAPI; expose only necessary public keys to PyScript via a `/config` JSON endpoint.
- **Scheduler/Workers**
  - Scheduled generator (07:00, per user time zone): fetch user goals → call AI → write tasks with difficulty/EXP.
  - Progress updater: aggregates completion to update goal progress, streaks, and difficulty.
  - Webhook endpoints for AI provider (if needed).
- **AI**: OpenAI/ChatGPT or local model for goal decomposition and daily plan generation (called from FastAPI worker path).

## Data Model Sketch (Firestore)
- `users/{userId}`: displayName, avatar, timeZone, preferredDailyTime, notificationsOn, toggles (gamification on/off).
- `goals/{goalId}`: userId, longTermGoal, baseline, deadline, timeBudgetWeekday/Weekend, status.
- `tasks/{taskId}`: goalId, date, title, detail, difficulty (1–5), exp, status (pending/doing/done), suggestedDuration, source (auto/manual).
- `progress/{goalId}/{date}`: completionRate, totalExp, streakCount, difficultyDelta.
- `loadouts/{userId}`: level, equipment list, outfits, roomDecor state.
- **Local drafts**: onboarding payload saved to localStorage/IndexedDB until Auth completes.

## Difficulty & EXP Rules (starter defaults)
- Difficulty 1→EXP 5, 2→10, 3→20, 4→35, 5→55.
- Auto-scale: if 3-day completion rate >80%, bump average difficulty by +1 (capped at 5); if <50%, reduce by -1 (min 1).
- Streak bonus: +10% EXP when streak ≥5 days.

## Directory Layout (proposal)
- `backend/app/` FastAPI app (routers for goals/tasks/auth/progress, webhook, scheduler endpoints).
- `backend/services/` Firestore, AI client, push/email adapters.
- `backend/jobs/` scheduled tasks (07:00 generator, progress updater).
- `web/` static assets, PyScript modules, HTMX views, Tailwind build output.
- `public/` PWA assets (manifest, icons, service worker).
- `infra/` IaC or deployment scripts (Cloud Run/Cloud Scheduler).
- `docs/` design docs (this file, backlog seeds, API contracts).

## Screen Outline
- **Onboarding**: Goal input, baseline, deadline, daily time, time zone, notification permission, toggles for gamification; local draft saved before Auth.
- **Home / Today**: auto-generated ToDos with difficulty badges, EXP reward preview, quick complete/skip; keyboard shortcuts on desktop.
- **History**: calendar list; show completion trends and difficulty adjustments.
- **Rewards**: level, EXP bar, equipment/outfit collection, room decoration.
- **Motivation**: streaks, encouragement feed, suggested small wins.
- **Settings**: preferred daily generation time, notifications, AI opt-out, data export; PWA install banner/trigger.

## Non-Functional Notes
- Respect time zones for the 07:00 scheduler (store IANA TZ; avoid guessing).
- Handle opt-out of notifications and AI calls; provide UI fallbacks.
- Keep state minimal and low-friction; prioritize fast add/complete interactions; offline-safe for short sessions.
- Service worker for caching critical assets/API responses; background sync (optional) for offline completions.
- Log events for difficulty tuning and retention experiments.

## Using This Template
- Convert features into GitHub Issues with `.github/ISSUE_TEMPLATE/main-template.md`.
- Start with the backlog seeds in `docs/backlog-seed.md`, then iterate with QA/test tasks.
- Keep modules aligned with the `backend/*` and `web/*` layout so tasks map cleanly to issues/labels.
