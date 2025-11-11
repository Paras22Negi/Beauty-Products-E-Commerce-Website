import React, { useState, useEffect } from "react";
import BlogHeader from "./components/BlogHeader";
import BlogGrid from "./components/BlogGrid.jsx";
import BlogDetailPage from "./BlogDetailPage.jsx";
import { blogsData } from "./BlogData.js"; // keep your mock data for now

// ✅ Import AOS for animations
import AOS from "aos";
import "aos/dist/aos.css";

const BlogListPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  // ✅ Initialize AOS once when component mounts
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      easing: "ease-in-out",
      once: true, // animate only once
    });
  }, []);

  if (selectedBlog) {
    return (
      <div data-aos="fade-up">
        <BlogDetailPage
          blog={selectedBlog}
          onBack={() => setSelectedBlog(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Animate header */}
      <div data-aos="fade-down">
        <BlogHeader
          totalArticles={blogsData.length}
          currentRange={{ start: 1, end: blogsData.length }}
        />
      </div>

      {/* ✅ Animate blog grid */}
      <div data-aos="fade-up" data-aos-delay="200">
        <BlogGrid blogs={blogsData} onBlogClick={setSelectedBlog} />
      </div>
    </div>
  );
};

export default BlogListPage;
