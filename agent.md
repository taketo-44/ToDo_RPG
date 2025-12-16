# Agent Specification (agent.md)

## Overview

This document describes the **AI Mentor Agent** used in the To-Do Tracker project. The agent supports long‑term goal achievement, daily task generation, and motivational feedback with RPG-style gamification.

---

## 1. Agent Purpose

* Help users **define goals** and convert them into actionable plans.
* Generate **daily ToDos** at a user-defined time (default 07:00).
* Provide **motivational elements** using difficulty-based experience points.
* Support **RPG-style progression** (levels, equipment, room decoration).
* Maintain user focus by minimizing friction and cognitive load.

---

## 2. Inputs

The agent receives the following data:

### 2.1 User Goal Information

* Long-term goal (例: *TOEIC 700*, *−5kg*, *Run a marathon*).
* Current status / baseline.
* Time available per day (weekday/holiday).
* Deadline or target period.

### 2.2 User Preferences

* Daily task generation time (default 07:00).
* Notification preferences.
* Gamification elements enabled/disabled.

---

## 3. Core Functions

### 3.1 Goal Decomposition

Convert user-provided goals into:

* **Long-term goals** (months scale)
* **Mid-term goals** (weeks scale)
* **Short-term goals** (days scale)

### 3.2 Daily ToDo Generation

* Generate a set of ToDos every morning at a defined time.
* Consider workload balancing.
* Adjust difficulty over time based on performance.

### 3.3 Difficulty & Experience System

* Each ToDo is assigned a **difficulty score**.
* Completing difficult tasks gives **more EXP**.
* EXP contributes to:

  * Leveling up
  * Unlocking equipment, outfits
  * Decorating user's room

### 3.4 Progress Tracking

* Update goal achievement rate.
* Adjust future tasks dynamically.
* Detect whether tasks are too easy or too hard.

### 3.5 Motivation Messages

* Provide encouragement.
* Suggest small wins.
* Reward streaks.

---

## 4. Data Flow

1. User submits goal.
2. Agent analyses goal → decomposes into multi-level tasks.
3. Each day:

   * Agent generates ToDos.
   * Assign difficulty + potential EXP.
4. User completes tasks.
5. Agent updates

   * EXP
   * Level
   * Goal progress
   * Tomorrow’s workload

---

## 5. Architecture Notes

* **Flutter** for mobile interface.
* **Firebase** for

  * Authentication (Google OAuth)
  * Database (user goals, tasks, EXP)
* **Cloud Functions** for scheduled ToDo generation.
* **AI Model** (ChatGPT API or local model) for goal decomposition.

---

## 6. GitHub Workflow

* All user stories & tasks must be converted into **GitHub Issues**.
* Each agent feature corresponds to an Issue category:

  * `goal-processing`
  * `todo-generation`
  * `motivation`
  * `gamification`
  * `ui-ux`
  * `firebase-integration`

---

## 7. Future Extensions

* Social features (party, guild).
* Boss tasks (weekly big mission).
* Habit tracking.
* AI-driven study plan templates.
* Adaptive difficulty.

---

## 8. License

Project-specific licensing goes here.
