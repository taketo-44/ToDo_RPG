import os
import json
from openai import OpenAI
from typing import List, Dict, Any

class TutorService:
    def __init__(self):
        # We assume OPENAI_API_KEY is set in environment variables
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = None
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            print("Warning: OPENAI_API_KEY not found. AI Tutor features will fail.")

    def _build_fallback_schedule(
        self,
        goal: str,
        baseline: str,
        days: int = 7,
        language: str = "en",
        situations: List[str] | None = None
    ) -> List[Dict[str, Any]]:
        goal_text = (goal or "your goal").strip()
        baseline_text = (baseline or "your current level").strip()
        situation_text = " / ".join(situations or [])

        if language == "ja":
            starter_titles = [
                "最初のマイルストーンを決める",
                "学習・作業環境を整える",
                "集中して練習する",
                "難しかった点を振り返る",
                "小さな成果物に応用する",
                "進捗を測って調整する",
                "次の1週間を計画する",
            ]
            starter_details = [
                f"「{goal_text}」を、近いうちに完了できる具体的なマイルストーンに分解する。",
                f"{baseline_text}と{situation_text or '今の生活状況'}を踏まえて、必要な道具、参考資料、制約を書き出す。",
                f"「{goal_text}」に向けて25〜45分の意図的な練習を行う。",
                "つまずいた点、疑問、繰り返し練習が必要なことを書き出す。",
                "今日の進捗がわかる小さな成果物を1つ作る。",
                "改善した点、止まった点を確認し、明日の範囲を調整する。",
                "継続するための次の行動を選ぶ。",
            ]
        else:
            starter_titles = [
                "Define the first milestone",
                "Prepare your study or work setup",
                "Complete a focused practice session",
                "Review what felt difficult",
                "Apply the skill in a small output",
                "Measure progress and adjust",
                "Plan the next week",
            ]
            starter_details = [
                f"Break '{goal_text}' into one concrete milestone you can finish soon.",
                f"List tools, references, and constraints based on {baseline_text} and {situation_text or 'your current situation'}.",
                f"Spend 25-45 minutes doing deliberate practice for '{goal_text}'.",
                "Write down blockers, questions, and what needs repetition.",
                "Create one small artifact that proves progress today.",
                "Check what improved, what stalled, and adjust tomorrow's scope.",
                "Choose the next actions to keep the streak going.",
            ]
        difficulties = [1, 2, 2, 3, 3, 2, 1]
        exp_map = {1: 5, 2: 10, 3: 20, 4: 35, 5: 55}

        schedule = []
        for index in range(days):
            difficulty = difficulties[index % len(difficulties)]
            schedule.append(
                {
                    "title": starter_titles[index % len(starter_titles)],
                    "description": starter_details[index % len(starter_details)],
                    "difficulty": difficulty,
                    "xp_reward": exp_map[difficulty],
                }
            )
        return schedule

    def generate_schedule(
        self,
        goal: str,
        baseline: str,
        days: int = 7,
        language: str = "en",
        situations: List[str] | None = None
    ) -> List[Dict[str, Any]]:
        """
        Generates a list of daily tasks based on the goal and baseline.
        """
        output_language = "Japanese" if language == "ja" else "English"
        situation_text = "\n".join(f"- {situation}" for situation in situations or [])

        if not self.client:
            print("OpenAI client not initialized.")
            return self._build_fallback_schedule(goal, baseline, days, language, situations)

        prompt = f"""
        You are an expert AI Tutor and RPG quest giver.
        The user wants to achieve: "{goal}".
        Their current baseline/context is: "{baseline}".
        Their additional situation settings are:
        {situation_text or "- None"}

        Please generate a {days}-day schedule of concrete, actionable daily tasks to help them progress.
        Adapt the task timing, scope, and difficulty to the situation settings when present.
        Write every task title and description in {output_language}.
        For each task, provide:
        - title: Short, action-oriented title.
        - description: Brief details on what to do.
        - difficulty: Integer 1-5 (1=Easy, 5=Hard).
        - xp_reward: Integer (e.g. 10-100 based on difficulty).

        Return ONLY a raw JSON array of objects. No markdown formatting.
        Example format:
        [
            {{"title": "Research Topic X", "description": "Read the first 2 chapters...", "difficulty": 2, "xp_reward": 20}},
            ...
        ]
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",  # or gpt-3.5-turbo if cost is a concern
                messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that outputs raw JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            content = response.choices[0].message.content.strip()
            # Cleanup markdown code blocks if present
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
                
            tasks = json.loads(content)
            if not tasks:
                return self._build_fallback_schedule(goal, baseline, days, language, situations)
            return tasks
        except Exception as e:
            print(f"Error generating schedule: {e}")
            return self._build_fallback_schedule(goal, baseline, days, language, situations)

tutor_service = TutorService()
