from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List

try:
    from backend.services.firestore import db
except ModuleNotFoundError:
    from services.firestore import db

router = APIRouter(prefix="/goals", tags=["goals"])

class GoalCreate(BaseModel):
    user_id: str
    long_term_goal: str
    baseline: str
    deadline: str
    daily_time_weekday: int  # minutes
    daily_time_weekend: int  # minutes
    language: str = "en"
    auto_generate_time: str = "08:00"
    situations: List[str] = Field(default_factory=list)
    holiday_until: Optional[str] = None
    notification_token: Optional[str] = None

class GoalResponse(GoalCreate):
    id: str

@router.post("/", response_model=GoalResponse)
async def create_goal(goal: GoalCreate):
    goal_data = goal.dict()
    goal_id = await db.add_document("goals", goal_data)
    
    # Trigger AI Tutor
    try:
        from backend.services.tutor import tutor_service
    except ModuleNotFoundError:
        from services.tutor import tutor_service
    # We run this synchronously here for simplicity, but in production this should be a background task
    schedule = tutor_service.generate_schedule(
        goal=goal.long_term_goal,
        baseline=goal.baseline,
        language=goal.language,
        situations=goal.situations
    )
    
    for task_data in schedule:
        task_data["goal_id"] = goal_id
        await db.add_document("tasks", task_data)
        
    return {**goal_data, "id": goal_id}

@router.get("/{user_id}", response_model=List[GoalResponse])
async def get_goals(user_id: str):
    all_goals = await db.get_collection("goals")
    user_goals = []
    for gid, data in all_goals.items():
        if data.get("user_id") == user_id:
            user_goals.append({**data, "id": gid})
    return user_goals
