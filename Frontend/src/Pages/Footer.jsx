import React, { useState, useRef, useEffect } from "react";
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


// Dropdown component with slide + fade effect
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
    <div className={`rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "" : "h-15"}`}>
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
          className="text-gray-300 p-2 space-y-2"
        >
          {items.map((item, idx) => (
            <li
              key={idx}
              className="hover:text-pink-500 cursor-pointer transition-colors"
            >
              {item.includes("@") ? (
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
    <footer className="bg-black text-white py-10 px-6 relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        {/* LEFT COLUMN */}
        <div>
          <div className="flex items-center mb-4">
            <img
              src="https://marscosmetics.in/cdn/shop/files/LOGO_WHITE-_MARS_150x@2x.png?v=1633455993"
              alt="MARS"
              className="h-10 w-35 mr-2"
            />
          </div>
          <p className="text-gray-300 mb-4 leading-relaxed">
            <span className="font-semibold text-white">
              Makeup for everyone
            </span>
            <br />
            <br />
            Discover accessible & super-affordable makeup designed for everyone.
            Based in India, we're here to embrace your unique and diverse
            beauty.
          </p>
          <div className="flex space-x-3 mt-2">
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

        {/* DROPDOWN SECTIONS */}
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

      {/* BOTTOM LINE */}
      <hr className="border-gray-700 my-6" />
      <div className="text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center w-full px-2">
        <p>© 2025, MARS Cosmetics</p>
        <p>
          Designed with <span className="text-pink-500">❤️</span> in India
        </p>
      </div>

      {/* HELP BUTTON */}
      <button className="absolute bottom-16 right-4 bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-600 flex items-center gap-2 transition">
        <span className="text-lg">❓</span> HELP
      </button>
    </footer>
  );
}

export default Footer;
