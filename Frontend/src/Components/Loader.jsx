import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
