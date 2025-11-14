import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      if (onClose) onClose(); // close search overlay if needed
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white text-black shadow-md z-[130] py-3 px-6 flex items-center justify-center gap-3">
      <form
        onSubmit={handleSearch}
        className="flex w-[80%] sm:w-[60%] md:w-[40%]"
      >
        <input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          className="ml-2 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
        >
          Search
        </button>
      </form>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-pink-600 font-semibold text-lg"
      >
        ✕
      </button>
    </div>
  );
}

export default SearchBar;
