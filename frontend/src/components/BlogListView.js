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
