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
      console.log(`Received data: ${event.data}`);
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
    axios
      .get("http://localhost:8000/api/blogs")
      .then((res) => {
        setBlogList(res.data);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        toast.error("Error fetching blogs");
      });
  };

  const addBlogHandler = () => {
    axios
      .post("http://localhost:8000/api/blog/", {
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
    axios
      .put(`http://localhost:8000/api/blog/${currentBlog.title}/`, {
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
