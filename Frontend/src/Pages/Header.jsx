import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { IoSearchSharp, IoCartOutline } from "react-icons/io5";

function Header() {
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  let closeTimeout= 200;

  const handleMouseEnter = () => {
    clearTimeout(closeTimeout);
    setIsCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    clearTimeout(closeTimeout);
    closeTimeout = setTimeout(() => setIsCategoryOpen(false), 300);
  };

  return (
    <div className="relative bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 relative z-20">
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

          {/* Category Hover Zone */}
          <div
            className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Category
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-8">
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

          <ul className="flex items-center space-x-4 text-2xl">
            <li className="cursor-pointer hover:text-gray-300">
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

      {/* Full-Width Navbar Dropdown */}
      {isCategoryOpen && (
        <div
          className="absolute top-full left-0 w-full bg-black border-t border-gray-700 shadow-md z-10 transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex justify-start px-10 py-6 space-x-12">
            {[
              {
                title: "Lips",
                items: [
                  "Lipstick",
                  "Lip Crayon",
                  "Lip Liner",
                  "Lip Gloss",
                  "Lip Balm",
                ],
              },
              { title: "Eyes", items: ["Eyeliner", "Mascara", "Eyeshadow"] },
              { title: "Face", items: ["Foundation", "Primer", "Concealer"] },
              { title: "Tools", items: ["Brushes", "Sponges", "Applicators"] },
              { title: "Combos", items: ["Gift Sets", "Travel Kits"] },
              {
                title: "New Arrivals",
                items: [
                  <div className="overflow-hidden rounded-md">
                    <img
                      src="https://marscosmetics.in/cdn/shop/files/Match-Stick_500x_8ed33da6-9c36-4d70-80c4-d70911ce086e.webp?v=1721369528&width=500"
                      alt="New Arrivals"
                      className="w-55 h-auto transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>,
                ],
              },
              {
                title: "Best Sellers",
                items: [
                  <div className="overflow-hidden rounded-md">
                    <img
                      src="https://marscosmetics.in/cdn/shop/files/Artboard_1_382a6a68-187a-4167-b228-ae36da46c664.png?v=1721370285&width=500"
                      alt="Best Sellers"
                      className="w-55 h-auto transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>,
                ],
              },
            ].map((section, i) => (
              <div key={i} className="min-w-[140px] flex flex-col">
                <h3 className="font-semibold text-gray-300 mb-3 uppercase">
                  {section.title}
                </h3>
                <ul className="space-y-1">
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
    </div>
  );
}

export default Header;
