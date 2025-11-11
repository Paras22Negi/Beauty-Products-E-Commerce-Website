import React, { useEffect } from "react";
import BlogDetailHeader from "./components/blogDetailHeader";
import BlogHeroImage from "./components/blogHeroImage";
import BlogMetadata from "./components/BlogMetadata_";
import BlogContent from "./components/blogContent";
import ShareSection from "./components/ShareSection";
import NextArticle from "./components/NextArticle";
import { blogsData } from "./BlogData";

// ✅ Import AOS for animations
import AOS from "aos";
import "aos/dist/aos.css";

const BlogDetailPage = ({ blog, onBack }) => {
  const currentIndex = blogsData.findIndex((b) => b.id === blog.id);
  const nextArticle = blogsData[(currentIndex + 1) % blogsData.length];

  // ✅ Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000, // how long each animation lasts
      easing: "ease-in-out",
      once: true, // animate once per page view
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Animate the top header */}
      <div data-aos="fade-down">
        <BlogDetailHeader onBack={onBack} />
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* ✅ Hero image fade-in */}
        <div data-aos="fade-up" data-aos-delay="100">
          <BlogHeroImage blog={blog} />
        </div>

        {/* ✅ Metadata slides in slightly later */}
        <div data-aos="fade-up" data-aos-delay="200">
          <BlogMetadata author={blog.author} date={blog.date} />
        </div>

        {/* ✅ Content fades in section by section */}
        <div data-aos="fade-up" data-aos-delay="300">
          <BlogContent content={blog.body} />
        </div>

        {/* ✅ Share section */}
        <div data-aos="zoom-in" data-aos-delay="400">
          <ShareSection />
        </div>

        {/* ✅ Next article section */}
        <div data-aos="fade-up" data-aos-delay="500">
          <NextArticle article={nextArticle} onClick={() => onBack()} />
        </div>
      </main>
    </div>
  );
};

export default BlogDetailPage;
