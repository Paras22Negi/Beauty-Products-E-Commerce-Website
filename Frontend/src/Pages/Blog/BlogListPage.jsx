import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../redux/Blog/action";
import BlogHeader from "./components/blogHeader.jsx";
import BlogGrid from "./components/BlogGrid.jsx";
import BlogDetailPage from "./BlogDetailPage.jsx";

// ✅ Import AOS for animations
import AOS from "aos";
import "aos/dist/aos.css";

const BlogListPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const dispatch = useDispatch();
  const { blogs, loading, error } = useSelector((store) => store.blog);

  // ✅ Initialize AOS once when component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      easing: "ease-in-out",
      once: true, // animate only once
    });
    dispatch(fetchBlogs());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const transformBlogData = (backendBlogs) => {
    if (!backendBlogs) return [];
    return backendBlogs.map((blog) => ({
      ...blog,
      id: blog._id,
      image:
        blog.images?.[0] ||
        "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80",
      allImages:
        blog.images && blog.images.length > 0
          ? blog.images
          : [
              "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80",
            ],
      excerpt: blog.summary,
      date: formatDate(blog.createdAt),
      color: "bg-purple-600",
      body: blog.content, // Map content to body for the detail page
    }));
  };

  const displayedBlogs = transformBlogData(blogs);

  if (selectedBlog) {
    const currentIndex = displayedBlogs.findIndex(
      (b) => b.id === selectedBlog.id
    );
    const nextBlog = displayedBlogs[(currentIndex + 1) % displayedBlogs.length];

    return (
      <div data-aos="fade-up">
        <BlogDetailPage
          blog={selectedBlog}
          nextArticle={nextBlog}
          onBack={() => setSelectedBlog(null)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading blogs: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      {/* ✅ Animate header */}
      <div data-aos="fade-down" data-aos-delay="100">
        <BlogHeader
          totalArticles={displayedBlogs.length}
          currentRange={{ start: 1, end: displayedBlogs.length }}
        />
      </div>

      {/* ✅ Animate blog grid */}
      <div data-aos="fade-up" data-aos-delay="200">
        <BlogGrid blogs={displayedBlogs} onBlogClick={setSelectedBlog} />
      </div>
    </div>
  );
};

export default BlogListPage;
