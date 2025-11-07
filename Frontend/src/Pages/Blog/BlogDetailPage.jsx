import React from "react";
import BlogDetailHeader from "./components/blogDetailHeader";
import BlogHeroImage from "./components/blogHeroImage";
import BlogMetadata from "./components/BlogMetadata_";
import BlogContent from "./components/blogContent";
import ShareSection from "./components/ShareSection";
import NextArticle from "./components/NextArticle";
import { blogsData } from "./BlogData";

const BlogDetailPage = ({ blog, onBack }) => {
  const currentIndex = blogsData.findIndex((b) => b.id === blog.id);
  const nextArticle = blogsData[(currentIndex + 1) % blogsData.length];

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogDetailHeader onBack={onBack} />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <BlogHeroImage blog={blog} />
        <BlogMetadata author={blog.author} date={blog.date} />
        <BlogContent content={blog.body} />
        <ShareSection />
        <NextArticle article={nextArticle} onClick={() => onBack()} />
      </main>
    </div>
  );
};

export default BlogDetailPage;
