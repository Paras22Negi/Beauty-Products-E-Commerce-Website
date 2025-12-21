import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { footerSections } from "./Data/FooterData";

// Reusable Dropdown Component
const Dropdown = ({ title, items, isOpen, toggle }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
      setOpacity(1);
    } else {
      setHeight("0px");
      setOpacity(0);
    }
  }, [isOpen]);

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${
        isOpen ? "" : "h-15"
      }`}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer p-4 bg-gray-900"
        onClick={toggle}
      >
        <h3 className="font-semibold text-lg">{title}</h3>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Collapsible Content */}
      <div
        ref={contentRef}
        style={{ height, transition: "height 0.4s ease" }}
        className="overflow-hidden bg-gray-900"
      >
        <ul
          style={{ opacity, transition: "opacity 0.4s ease 0.1s" }}
          className="text-gray-300 p-3 space-y-2"
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              className="hover:text-pink-500 cursor-pointer transition-colors text-sm sm:text-base"
            >
              {typeof item === "object" ? (
                <Link to={item.path}>{item.label}</Link>
              ) : item.includes("@") ? (
                <a href={`mailto:${item.split(": ")[1]}`} className="underline">
                  {item}
                </a>
              ) : (
                item
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function Footer() {
  const [openSection, setOpenSection] = useState(null);

  return (
    <footer className="bg-black text-white py-10 px-6 md:px-10 relative w-screen">
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-7xl mx-auto">
        {/* Left Column */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="https://marscosmetics.in/cdn/shop/files/LOGO_WHITE-_MARS_150x@2x.png?v=1633455993"
              alt="MARS"
              className="h-10 w-auto mr-2"
            />
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
            <span className="font-semibold text-white">
              Makeup for everyone
            </span>
            <br />
            <br />
            Discover accessible & super-affordable makeup designed for everyone.
            Based in India, we're here to embrace your unique and diverse
            beauty.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-3 text-lg">
            {[FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube].map(
              (Icon, idx) => (
                <Icon
                  key={idx}
                  className="hover:text-pink-500 cursor-pointer transition-colors"
                />
              )
            )}
          </div>
        </div>

        {/* Dropdown Sections */}
        {footerSections.map((section, idx) => (
          <Dropdown
            key={idx}
            title={section.title}
            items={section.items}
            isOpen={openSection === section.title}
            toggle={() =>
              setOpenSection((prev) =>
                prev === section.title ? null : section.title
              )
            }
          />
        ))}
      </div>

      {/* Divider */}
      <hr className="border-gray-700 my-8 max-w-7xl mx-auto" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-gray-500 text-xs sm:text-sm px-2 text-center">
        <p>© 2025, MARS Cosmetics</p>
        <p>
          Designed with <span className="text-pink-500">❤️</span> in India
        </p>
      </div>

      {/* Help Button */}
      <Link
        to="/support"
        className="fixed bottom-6 right-6 bg-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-600 flex items-center gap-2 text-sm sm:text-base shadow-lg transition z-[9999]"
      >
        <span className="text-lg">❓</span> HELP
      </Link>
    </footer>
  );
}

export default Footer;
