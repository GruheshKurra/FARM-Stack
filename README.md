This project is a blog website built using React for the frontend, FastAPI for the backend, and MongoDB for the database. The website supports CRUD operations for blog posts, including real-time updates using WebSockets.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Frontend Code](#frontend-code)
- [Backend Code](#backend-code)
- [Screenshots](#screenshots)
- [Conclusion](#conclusion)


## Features

- Add, edit, delete, and view blog posts
- Real-time updates using WebSockets
- Responsive UI with React and Bootstrap

## Technologies Used

- **Frontend:** React, Axios, Bootstrap, React-Toastify
- **Backend:** FastAPI, Pydantic, Uvicorn
- **Database:** MongoDB
- **WebSockets:** FastAPI WebSocket

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm
- Python 3.7+
- MongoDB

## Installation

### Backend

1. **Clone the repository:**

   ```sh
   git clone https://github.com/GruheshKurra/FARM-Stack.git
   cd blog-website/backend
   ```

2. **Install the required packages:**

   ```sh
   pip install -r requirements.txt
   ```

3.  **Ensure the requirements.txt includes:**

   ```txt
   fastapi
   uvicorn[standard]
   pydantic
   motor
   ```

4. **Run the FastAPI server:**

   ```sh
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend

1. **Navigate to the frontend directory:**

   ```sh
   cd ../frontend
   ```

2. **Install the required packages:**

   ```sh
   npm install
   ```

3. **Setting Node.js Environment for Legacy OpenSSL Provider Usage**

   ```sh
   $env:NODE_OPTIONS="--openssl-legacy-provider"
   ```

4. **Start the React development server:**

   ```sh
   npm start
   ```

## Running the Application

1. **Start MongoDB:**

   Ensure MongoDB is running. You can start it using the command:

   ```sh
   mongod
   ```

2. **Start the FastAPI server:**

   Ensure your backend server is running with the command:

   ```sh
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Start the React development server:**

   Ensure your frontend server is running with the command:

   ```sh
   npm start
   ```

## Project Structure

```
blog-website/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── model.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlogListView.js
│   │   │   ├── BlogDetail.js
│   │   │   ├── BlogItem.js
│   │   ├── App.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
```

## Frontend Code

### App.js

```javascript
import React, { useState, useEffect } from "react";
import "./App.css";
import BlogView from "./components/BlogListView";
import BlogDetail from "./components/BlogDetail";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [blogList, setBlogList] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    refreshBlogs();

    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = function (event) {
      console.log("WebSocket connection established", event);
      toast.info("WebSocket connection established");
    };

    socket.onmessage = function (event) {
      console.log(Received data: \${event.data});
      if (event.data === "update") {
        refreshBlogs();
        toast.info("Real-time update received");
      }
    };

    socket.onclose = function (event) {
      console.log("WebSocket connection closed", event);
      toast.warning("WebSocket connection closed");
    };

    socket.onerror = function (error) {
      console.log("WebSocket error", error);
      toast.error("WebSocket error occurred");
    };

    return () => {
      socket.close();
    };
  }, []);

  const refreshBlogs = () => {
    axios.get("http://localhost:8000/api/blogs")
      .then((res) => {
        setBlogList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        toast.error("Error fetching blogs");
      });
  };

  const addBlogHandler = () => {
    axios.post("http://localhost:8000/api/blog/", {
      title: title,
      content: content,
      image_url: imageURL,
    })
    .then((res) => {
      console.log(res);
      setTitle("");
      setContent("");
      setImageURL("");
      toast.success("Blog added successfully");
      refreshBlogs();
    })
    .catch((error) => {
      console.error("Error adding blog:", error);
      toast.error("Error adding blog");
    });
  };

  const updateBlogHandler = () => {
    axios.put(http://localhost:8000/api/blog/\${currentBlog.title}/, {
      title: title || currentBlog.title,
      content: content || currentBlog.content,
      image_url: imageURL || currentBlog.image_url,
    })
    .then((res) => {
      console.log("Update response:", res);
      setTitle("");
      setContent("");
      setImageURL("");
      setIsEditing(false);
      toast.success("Blog updated successfully");
      refreshBlogs();
    })
    .catch((error) => {
      console.error("Error updating blog:", error);
      toast.error("Error updating blog");
    });
  };

  const editBlogHandler = (blog) => {
    setIsEditing(true);
    setCurrentBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setImageURL(blog.image_url);
  };

  const viewBlogHandler = (blog) => {
    setCurrentBlog(blog);
    setShowDetail(true);
  };

  const closeBlogDetail = () => {
    setShowDetail(false);
  };

  return (
    <div>
      <nav className="navbar">
        <a href="/">Blog Manager</a>
      </nav>
      <div className="App container mt-5">
        <ToastContainer />
        <div className="form-container mb-5">
          <h5>{isEditing ? "Edit Your Blog" : "Add Your Blog"}</h5>
          <input
            className="mb-2 form-control"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            placeholder="Title"
          />
          <textarea
            className="mb-2 form-control"
            onChange={(event) => setContent(event.target.value)}
            value={content}
            placeholder="Content"
          />
          <input
            className="mb-2 form-control"
            onChange={(event) => setImageURL(event.target.value)}
            value={imageURL}
            placeholder="Image URL"
          />
          <button
            className="btn btn-primary"
            onClick={isEditing ? updateBlogHandler : addBlogHandler}
          >
            {isEditing ? "Update Blog" : "Add Blog"}
          </button>
        </div>
        <BlogView
          blogList={blogList}
          refreshBlogs={refreshBlogs}
          editBlogHandler={editBlogHandler}
          viewBlogHandler={viewBlogHandler}
        />
        {showDetail && (
          <BlogDetail blog={currentBlog} closeHandler={closeBlogDetail} />
        )}
      </div>
      <br />
      <br />
      <br />
      <footer className="footer">
        <p>&copy; 2024 Blog Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
```

### BlogListView.js

```javascript
import React, { useState, useEffect } from "react";
import React from "react";
import BlogItem from "./BlogItem";

export default function BlogView(props) {
  return (
    <div className="row">
      {props.blogList.map((blog) => (
        <div className="col-md-4 mb-4" key={blog.title}>
          <BlogItem
            blog={blog}
            refreshBlogs={props.refreshBlogs}
            editBlogHandler={props.editBlogHandler}
            viewBlogHandler={props.viewBlogHandler}
          />
        </div>
      ))}
    </div>
  );
}

```

### BlogItem.js

```javascript
import React from "react";
import axios from "axios";

function BlogItem(props) {
  const deleteBlogHandler = (title) => {
    axios.delete(`http://localhost:8000/api/blog/${title}`).then((res) => {
      console.log(res.data);
      props.refreshBlogs(); // Refresh the blog list
    });
  };

  const editBlogHandler = () => {
    props.editBlogHandler(props.blog);
  };

  const viewBlogHandler = () => {
    props.viewBlogHandler(props.blog);
  };

  return (
    <div className="card mb-3">
      <img
        src={props.blog.image_url}
        className="card-img-top"
        alt={props.blog.title}
      />
      <div className="card-body">
        <h5 className="card-title">{props.blog.title}</h5>
        <p className="card-text">{props.blog.content.substring(0, 100)}...</p>
        <button onClick={viewBlogHandler} className="btn btn-primary">
          View
        </button>
        <button onClick={editBlogHandler} className="btn btn-info mx-2">
          Edit
        </button>
        <button
          onClick={() => deleteBlogHandler(props.blog.title)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BlogItem;

```

### BlogDetail.js

```javascript
import React from "react";

const BlogDetail = ({ blog, closeHandler }) => {
  return (
    <div className="blog-detail">
      <button className="btn btn-secondary mb-3" onClick={closeHandler}>
        Close
      </button>
      <h2>{blog.title}</h2>
      <img
        src={blog.image_url}
        alt={blog.title}
        style={{ width: "50%", margin: "0 auto", display: "block" }}
      />
      <p className="text-center">{blog.content}</p>
    </div>
  );
};

export default BlogDetail;

```

## Backend Code

### database.py

```python
import motor.motor_asyncio
from model import Blog

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017/')
database = client.BlogDatabase
collection = database.blog

async def fetch_one_blog(title):
    document = await collection.find_one({"title": title})
    return document

async def fetch_all_blogs():
    blogs = []
    cursor = collection.find({})
    async for document in cursor:
        blogs.append(Blog(**document))
    return blogs

async def create_blog(blog):
    document = blog
    result = await collection.insert_one(document)
    return document

async def update_blog(title, blog_data):
    await collection.update_one({"title": title}, {"$set": blog_data})
    document = await collection.find_one({"title": title})
    return document

async def remove_blog(title):
    await collection.delete_one({"title": title})
    return True
```

### main.py

```python
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
```

### model.py

```python
from pydantic import BaseModel

class Blog(BaseModel):
    title: str
    content: str
    image_url: str

```

## Screenshots

Here you would include screenshots of the following:

1. **Home Page:**
   ![Home Page](path/to/homepage-screenshot.png)

2. **Add Blog Form:**
   ![Add Blog](path/to/add-blog-screenshot.png)

3. **Blog List:**
   ![Blog List](path/to/blog-list-screenshot.png)

4. **Blog Detail View:**
   ![Blog Detail](path/to/blog-detail-screenshot.png)

5. **Edit Blog Form:**
   ![Edit Blog](path/to/edit-blog-screenshot.png)

## Conclusion

This project demonstrates a full-stack application using React for the frontend, FastAPI for the backend, and MongoDB for the database. The application supports CRUD operations for blog posts with real-time updates using WebSockets.

By following this guide, you should be able to set up and run the application on your local machine. Feel free to explore the code and make any improvements or modifications as needed. Contributions to the project are welcome through pull requests or by opening issues.

For a complete walkthrough of the project, you can refer to the video tutorial [here](path/to/video-tutorial).

Happy coding!
