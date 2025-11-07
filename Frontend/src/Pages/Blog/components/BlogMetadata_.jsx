import React from "react";
import { User, Calendar } from "lucide-react";

const BlogMetadata = ({ author, date }) => {
  return (
    <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <User size={16} />
        <span>{author}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar size={16} />
        <span>{date}</span>
      </div>
    </div>
  );
};

export default BlogMetadata;
