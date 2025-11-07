import React from "react";

const BlogHeroImage = ({ blog }) => {
  return (
    <div className="relative h-96 rounded-3xl overflow-hidden mb-8 shadow-xl">
      <div className={`absolute inset-0 ${blog.color} opacity-90`}></div>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center leading-tight">
          {blog.title}
        </h1>
      </div>
    </div>
  );
};

export default BlogHeroImage;
