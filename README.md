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
   git clone https://github.com/yourusername/blog-website.git
   cd blog-website/backend
   ```

2. **Create a virtual environment and activate it:**

   ```sh
   python -m venv env
   source env/bin/activate  # On Windows use `env\\Scripts\\activate`
   ```

3. **Install the required packages:**

   ```sh
   pip install -r requirements.txt
   ```

   Ensure the \`requirements.txt\` includes:

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

3. **Start the React development server:**

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

### \`App.js\`

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
      console.log(\`Received data: \${event.data}\`);
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
    axios.put(\`http://localhost:8000/api/blog/\${currentBlog.title}/\`, {
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

### \`BlogListView.js\`

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

### \`BlogItem.js\`

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

### \`BlogDetail.js\`

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

