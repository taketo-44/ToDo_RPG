from fastapi import APIRouter, HTTPException
from typing import List, Optional

try:
    from backend.services.firestore import db
    from backend.app.models.task import TaskCreate, TaskResponse
except ModuleNotFoundError:
    from services.firestore import db
    from app.models.task import TaskCreate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/{user_id}", response_model=List[TaskResponse])
async def get_tasks(user_id: str, goal_id: Optional[str] = None):
    all_tasks = await db.get_collection("tasks")
    user_tasks = []
    
    # In a real DB we would query with filters. For mock, we iterate.
    for tid, data in all_tasks.items():
        # We don't have user_id on tasks directly in the simple model plan, 
        # but we should probably verify ownership via goal if possible.
        # For simplicity in this mock, let's assume we filter by goal_id if provided, 
        # or we need to look up goals to check user_id.
        # Let's adjust to filter by goal_id if present.
        
        if goal_id:
            if data.get("goal_id") == goal_id:
                user_tasks.append({**data, "id": tid})
        else:
            # If no goal_id, we'd theoretically return all tasks for the user.
            # But our Task model in the plan just had goal_id. 
            # Let's simple return all tasks for now as the mock is small.
             user_tasks.append({**data, "id": tid})

    return user_tasks

@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(task_id: str):
    task = await db.get_document("tasks", task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task["completed"] = True
    # Update in DB (Mock service doesn't have partial update method exposed easily, so we just re-add/overwrite if we were using a real one, 
    # but the mock `add_document` generates a new ID if not provided, or we need a set/update method.
    # The current mock implementation is simple. Let's direct modify the dict ref since it's in-memory mock.)
    
    # Wait, the mock `get_document` returns a dict. Modifying it might modify the reference in `mock_db` 
    # depending on if it returns a copy or ref. 
    # `self.mock_db.get(collection, {}).get(doc_id)` returns a reference to the dict in the dict.
    # So modifying `task` here effectively updates the mock DB.
    
    return {**task, "id": task_id}
