import React from "react";

const BlogHeader = ({ totalArticles, currentRange }) => {
  return (
    <header className="bg-white shadow-sm top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Makeup Tips</h1>
          <div className="text-sm text-gray-600">
            Showing {currentRange.start} to {currentRange.end} of{" "}
            {totalArticles} articles
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;
