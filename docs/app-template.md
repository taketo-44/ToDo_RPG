# ToDo RPG App Template

This starter blueprint is based on `agent.md` and the issue template. It captures the core loops, tech stack, and file layout you can flesh out with real code.

## Product Goals
- Help users define long-term goals and break them into mid/short-term tasks.
- Auto-generate balanced daily ToDos at a set time (default 07:00).
- Assign difficulty → award EXP for completions; drive levels, outfits/equipment, and room decoration.
- Keep motivation high with streaks, small wins, and adaptive difficulty.

## Core User Flows
1. **Onboarding**: Capture goal, baseline, daily time budget, deadline, notification preferences.
2. **Daily generation (07:00 default)**: Cloud Function calls AI goal decomposition → stores daily tasks with difficulty/EXP and notifies user.
3. **Task execution**: User completes ToDos, gains EXP, progresses level/equipment/room state.
4. **Adjustment loop**: Completion data tunes future difficulty and workload; sends encouragement.

## Architecture (suggested)
- **Client**: Flutter mobile app.
  - Screens: onboarding, daily ToDo list, calendar/history, rewards (level/equipment/room), settings.
  - State: provider/bloc/rxdart (choose), offline cache (optional later).
- **Backend**: Firebase.
  - Auth: Google OAuth.
  - Data: Firestore (`users`, `goals`, `tasks`, `progress`, `loadouts`, `rooms`).
  - Messaging: FCM for daily ToDo notifications and streak reminders.
- **Cloud Functions**
  - Scheduled generator (07:00): fetch user goals → call AI → write tasks with difficulty/EXP.
  - Progress updater: aggregates completion to update goal progress, streaks, and difficulty.
  - Webhook endpoints for AI provider (if needed).
- **AI**: OpenAI/ChatGPT or local model for goal decomposition and daily plan generation (called from Functions).

## Data Model Sketch (Firestore)
- `users/{userId}`: displayName, avatar, timeZone, preferredDailyTime, notificationsOn, toggles (gamification on/off).
- `goals/{goalId}`: userId, longTermGoal, baseline, deadline, timeBudgetWeekday/Weekend, status.
- `tasks/{taskId}`: goalId, date, title, detail, difficulty (1–5), exp, status (pending/doing/done), suggestedDuration, source (auto/manual).
- `progress/{goalId}/{date}`: completionRate, totalExp, streakCount, difficultyDelta.
- `loadouts/{userId}`: level, equipment list, outfits, roomDecor state.

## Difficulty & EXP Rules (starter defaults)
- Difficulty 1→EXP 5, 2→10, 3→20, 4→35, 5→55.
- Auto-scale: if 3-day completion rate >80%, bump average difficulty by +1 (capped at 5); if <50%, reduce by -1 (min 1).
- Streak bonus: +10% EXP when streak ≥5 days.

## Directory Layout (proposal)
- `lib/core/` shared (theme, routing, analytics, error handling).
- `lib/features/goal/` onboarding + goal detail.
- `lib/features/todo/` daily list, task detail, calendar/history.
- `lib/features/gamification/` EXP/level/equipment/room UI.
- `lib/features/motivation/` messages, streaks, notifications.
- `lib/features/settings/` preferences, toggles.
- `functions/` Firebase Cloud Functions (generator, progress updater, notification dispatcher).
- `docs/` design docs (this file, backlog seeds, API contracts).

## Screen Outline
- **Onboarding**: Goal input, baseline, deadline, daily time, notification permission, toggles for gamification.
- **Home / Today**: auto-generated ToDos with difficulty badges, EXP reward preview, quick complete/skip.
- **History**: calendar list; show completion trends and difficulty adjustments.
- **Rewards**: level, EXP bar, equipment/outfit collection, room decoration.
- **Motivation**: streaks, encouragement feed, suggested small wins.
- **Settings**: preferred daily generation time, notifications, AI opt-out, data export.

## Non-Functional Notes
- Respect time zones for the 07:00 scheduler.
- Handle opt-out of notifications and AI calls.
- Keep state minimal and low-friction; prioritize fast add/complete interactions.
- Log events for difficulty tuning and retention experiments.

## Using This Template
- Convert features into GitHub Issues with `.github/ISSUE_TEMPLATE/main-template.md`.
- Start with the backlog seeds in `docs/backlog-seed.md`, then iterate with QA/test tasks.
- When creating code, keep modules aligned with the `lib/features/*` layout so tasks map cleanly to issues/labels.
