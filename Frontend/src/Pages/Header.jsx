import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { IoSearchSharp, IoCartOutline } from "react-icons/io5";

function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // for search bar
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
    // You can navigate to a search results page or filter products here
  };

  return (
    <div className="relative bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center"
          >
            <img
              src="https://marscosmetics.in/cdn/shop/files/LOGO_WHITE-_MARS_53df8062-5f84-48be-8ba2-040963552e1e_120x@2x.png?v=1717479443"
              alt="MARS Logo"
              className="h-10 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
            />
          </div>

          {/* Category */}
          <div
            className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            Category
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <ul className="flex items-center space-x-6">
            <li
              onClick={() => navigate("/storeLocator")}
              className="cursor-pointer hover:text-gray-300"
            >
              StoreLocator
            </li>
            <li
              onClick={() => navigate("/aboutUs")}
              className="cursor-pointer hover:text-gray-300"
            >
              AboutUs
            </li>
            <li
              onClick={() => navigate("/blog")}
              className="cursor-pointer hover:text-gray-300"
            >
              Blog
            </li>
            <li
              onClick={() => navigate("/support")}
              className="cursor-pointer hover:text-gray-300"
            >
              Support
            </li>
          </ul>

          {/* Icons */}
          <ul className="flex items-center space-x-4 text-2xl">
            <li
              className="cursor-pointer hover:text-gray-300"
              onClick={() => setSearchOpen(!searchOpen)} // toggle search bar
            >
              <IoSearchSharp />
            </li>
            <li
              onClick={() => navigate("/account")}
              className="cursor-pointer hover:text-gray-300"
            >
              <MdAccountCircle />
            </li>
            <li className="cursor-pointer hover:text-gray-300">
              <IoCartOutline />
            </li>
          </ul>
        </div>
      </div>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          className="absolute top-full left-0 w-screen bg-black text-white shadow-lg z-50"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-4 gap-6">
            <div>
              <h4 className="font-bold mb-2">Skincare</h4>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer">
                  Face Wash
                </li>
                <li className="hover:text-gray-300 cursor-pointer">
                  Moisturizer
                </li>
                <li className="hover:text-gray-300 cursor-pointer">Serum</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Makeup</h4>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer">Lipstick</li>
                <li className="hover:text-gray-300 cursor-pointer">
                  Foundation
                </li>
                <li className="hover:text-gray-300 cursor-pointer">Mascara</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Haircare</h4>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer">Shampoo</li>
                <li className="hover:text-gray-300 cursor-pointer">
                  Conditioner
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Bodycare</h4>
              <ul className="space-y-1">
                <li className="hover:text-gray-300 cursor-pointer">
                  Body Lotion
                </li>
                <li className="hover:text-gray-300 cursor-pointer">Scrubs</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-screen bg-black px-6 py-4 z-50">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-l-md text-black focus:outline-none bg-white placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-gray-200 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Header;
