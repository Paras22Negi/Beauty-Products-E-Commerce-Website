import React, { useState } from "react";
import BlogHeader from "./components/blogHeader";
import BlogGrid from "./components/BlogGrid.jsx";
import BlogDetailPage from "./BlogDetailPage.jsx";
import { blogsData } from "./BlogData.js";

const BlogListPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  if (selectedBlog) {
    return (
      <BlogDetailPage
        blog={selectedBlog}
        onBack={() => setSelectedBlog(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogHeader
        totalArticles={blogsData.length}
        currentRange={{ start: 1, end: blogsData.length }}
      />
      <BlogGrid blogs={blogsData} onBlogClick={setSelectedBlog} />
    </div>
  );
};

export default BlogListPage;
