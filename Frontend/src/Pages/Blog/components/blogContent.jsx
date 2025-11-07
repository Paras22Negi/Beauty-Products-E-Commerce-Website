import React from "react";

const BlogContent = ({ content }) => {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-gray-700 leading-relaxed text-lg">{content}</p>
    </div>
  );
};

export default BlogContent;
