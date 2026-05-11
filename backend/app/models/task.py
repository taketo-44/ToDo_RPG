from pydantic import BaseModel
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    difficulty: int = 1  # 1-5 scale
    xp_reward: int = 10
    goal_id: str

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: str
    completed: bool = False
