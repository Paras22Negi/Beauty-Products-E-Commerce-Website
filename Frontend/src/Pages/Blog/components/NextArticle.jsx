import React from "react";

const NextArticle = ({ article, onClick }) => {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Next article</h3>
      <div
        onClick={onClick}
        className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      >
        <div
          className={`w-24 h-24 rounded-xl ${article.color} flex-shrink-0`}
        ></div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">{article.title}</h4>
          <p className="text-sm text-gray-600">{article.date}</p>
        </div>
      </div>
    </div>
  );
};

export default NextArticle;
