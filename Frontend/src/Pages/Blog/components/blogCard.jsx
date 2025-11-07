import React from "react";
import { Calendar, User } from "lucide-react";

const BlogCard = ({ blog, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-64 overflow-hidden">
        <div className={`absolute inset-0 ${blog.color} opacity-90`}></div>
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center leading-tight">
            {blog.title}
          </h2>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{blog.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
