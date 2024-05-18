import asyncio
from fastapi import FastAPI, WebSocket, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from model import Blog
from database import (
    fetch_one_blog,
    fetch_all_blogs,
    create_blog,
    update_blog,
    remove_blog,
)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clients: List[WebSocket] = []

class UpdateBlog(BaseModel):
    title: Optional[str]
    content: Optional[str]
    image_url: Optional[str]

@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/api/blogs")
async def get_blogs():
    response = await fetch_all_blogs()
    return response

@app.get("/api/blog/{title}", response_model=Blog)
async def get_blog_by_title(title: str):
    response = await fetch_one_blog(title)
    if response:
        return response
    raise HTTPException(404, f"There is no blog with the title {title}")

@app.post("/api/blog/", response_model=Blog)
async def post_blog(blog: Blog):
    response = await create_blog(blog.dict())
    if response:
        await notify_clients()
        return response
    raise HTTPException(400, "Something went wrong")

@app.put("/api/blog/{title}/", response_model=Blog)
async def put_blog(title: str, blog: UpdateBlog):
    response = await update_blog(title, blog.dict(exclude_unset=True))
    if response:
        await notify_clients()
        return response
    raise HTTPException(404, f"There is no blog with the title {title}")

@app.delete("/api/blog/{title}")
async def delete_blog(title: str):
    response = await remove_blog(title)
    if response:
        await notify_clients()
        return "Successfully deleted blog"
    raise HTTPException(404, f"There is no blog with the title {title}")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Message from client: {data}")
    except Exception as e:
        print(f"WebSocket connection closed: {e}")
    finally:
        clients.remove(websocket)

async def notify_clients():
    for client in clients:
        await client.send_text("update")
