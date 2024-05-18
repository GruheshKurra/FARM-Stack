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
