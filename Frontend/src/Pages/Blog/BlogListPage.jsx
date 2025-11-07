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


// // Remove this:
// import { blogsData } from '../data/BlogData';

// // Add this:
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchBlogs } from '../redux/blog/action';

// // In component:
// const dispatch = useDispatch();
// const { blogs, loading, error } = useSelector((state) => state.blog);

// useEffect(() => {
//   dispatch(fetchBlogs());
// }, [dispatch]);