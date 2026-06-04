from fastapi import FastAPI

app = FastAPI()

tasks=[]

@app.get("/")
def home():
    return {"message": "Todo API Running"}

@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def create_task(title:str):
    
    task={
        "id": len(tasks) +1,
        "tital": title,
        "completed": False
    }
    
    tasks.append(task)
    
    return task

@app.put("/tasks/{task_id}")
def complete_task(task_id: int):
    for task in tasks:
        if task["id"]==task_id:
            task["completed"]= True
            return task
        
    return{"error":"Task not found"}    

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):

    for task in tasks:
        if task["id"] == task_id:
            tasks.remove(task)
            return {"message": "Deleted"}

    return {"error": "Task not found"}