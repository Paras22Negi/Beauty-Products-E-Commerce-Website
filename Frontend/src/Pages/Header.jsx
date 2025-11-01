import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { IoSearchSharp, IoCartOutline } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { HeaderCategoryData } from "./Data/HeaderCategoryData";

function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  let closeTimeout;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => setIsCategoryOpen(false), 300);
  };

  return (
    <>
      {/* 🔍 Search Bar */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full bg-white text-black shadow-md z-[130] py-3 px-6 flex items-center justify-center gap-3">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-[80%] sm:w-[60%] md:w-[40%] border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-gray-500 hover:text-pink-600 font-semibold text-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* 🔹 Header */}
      <div className="fixed top-[40px] sm:top-[44px] left-0 w-full bg-black text-white z-[110] shadow-md">
        <div className="flex items-center justify-between px-3 sm:px-6 md:px-10 py-4 sm:py-5 md:py-4">
          {/* Logo & Category */}
          <div className="flex items-center space-x-5 sm:space-x-8">
            <div
              onClick={() => navigate("/")}
              className="cursor-pointer flex items-center"
            >
              <img
                src="https://marscosmetics.in/cdn/shop/files/LOGO_WHITE-_MARS_53df8062-5f84-48be-8ba2-040963552e1e_120x@2x.png?v=1717479443"
                alt="MARS Logo"
                className="h-10 sm:h-12 md:h-10 w-auto object-contain hover:opacity-80 transition-opacity duration-200"
              />
            </div>

            <div
              className="cursor-pointer hover:text-gray-300 transition-colors text-sm sm:text-base"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              Category
            </div>
          </div>

          {/* Nav Links + Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center space-x-5 md:space-x-6">
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

            {/* Mobile Menu Button */}
            <div
              className="md:hidden cursor-pointer text-2xl hover:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <HiOutlineDotsVertical />
            </div>

            {/* Icons */}
            <ul className="flex items-center space-x-3 sm:space-x-5 text-xl sm:text-2xl">
              <li
                className="cursor-pointer hover:text-gray-300"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
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

        {/* Category Dropdown */}
        {isCategoryOpen && (
          <div
            className="absolute top-full left-0 w-full bg-black border-t border-gray-700 shadow-md z-[90]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-wrap justify-start px-4 sm:px-10 py-6 gap-6 sm:gap-10">
              {HeaderCategoryData.map((section, i) => (
                <div key={i} className="min-w-[120px] sm:min-w-[140px]">
                  <h3 className="font-semibold text-gray-300 mb-3 uppercase text-sm sm:text-base">
                    {section.title}
                  </h3>
                  <ul className="space-y-1 text-sm sm:text-base">
                    {section.items.map((item, j) => (
                      <li
                        key={j}
                        className="hover:text-pink-400 cursor-pointer transition-colors"
                      >
                        {item}
                      </li>
                    ))}
                    <li className="hover:text-pink-400 cursor-pointer transition-colors">
                      <u>View All</u>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-4 top-full mt-2 bg-black border border-gray-700 rounded-lg shadow-lg z-[95] md:hidden">
            <ul className="flex flex-col py-2 text-sm sm:text-base">
              <li
                onClick={() => {
                  navigate("/storeLocator");
                  setIsMenuOpen(false);
                }}
                className="px-6 py-2 hover:bg-gray-800 cursor-pointer"
              >
                StoreLocator
              </li>
              <li
                onClick={() => {
                  navigate("/aboutUs");
                  setIsMenuOpen(false);
                }}
                className="px-6 py-2 hover:bg-gray-800 cursor-pointer"
              >
                AboutUs
              </li>
              <li
                onClick={() => {
                  navigate("/blog");
                  setIsMenuOpen(false);
                }}
                className="px-6 py-2 hover:bg-gray-800 cursor-pointer"
              >
                Blog
              </li>
              <li
                onClick={() => {
                  navigate("/support");
                  setIsMenuOpen(false);
                }}
                className="px-6 py-2 hover:bg-gray-800 cursor-pointer"
              >
                Support
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
