import React from "react";
import BlogCard from "./blogCard";

const BlogGrid = ({ blogs, onBlogClick }) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            onClick={() => onBlogClick(blog)}
          />
        ))}
      </div>
    </main>
  );
};

export default BlogGrid;
