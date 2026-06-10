from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory DB
tasks = []
next_id = 1

# Models
class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    title: str | None = None
    completed: bool | None = None

@app.get("/")
def home():
    return {"message": "Todo API Running"}

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def add_task(task: TaskCreate):
    global next_id

    new_task = {
        "id": next_id,
        "title": task.title,
        "completed": False
    }

    tasks.append(new_task)
    next_id += 1
    return new_task

@app.put("/tasks/{task_id}/done")
def mark_done(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            task["completed"] = True
            return task
    return {"error": "Not found"}

@app.put("/tasks/{task_id}")
def update_task(task_id: int, data: TaskUpdate):
    for task in tasks:
        if task["id"] == task_id:

            if data.title is not None:
                task["title"] = data.title

            if data.completed is not None:
                task["completed"] = data.completed

            return task

    return {"error": "Not found"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
            return {"message": "Deleted"}

    return {"error": "Not found"}