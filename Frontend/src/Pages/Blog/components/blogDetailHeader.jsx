import React from "react";
import { ArrowLeft } from "lucide-react";

const BlogDetailHeader = ({ onBack }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <button
          onClick={onBack}
          className="cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to blog</span>
        </button>
      </div>
    </header>
  );
};

export default BlogDetailHeader;
