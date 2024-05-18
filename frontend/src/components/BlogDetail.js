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
