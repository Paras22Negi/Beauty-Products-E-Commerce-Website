import React from "react";
import { helpData } from "../Data/MarsHelpSelectionData";

function MarsHelpSection() {
  return (
    <div className="bg-[#e8e8e8] py-12">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold mb-10 text-[#1b1b1b]">
        Don’t Worry, <span className="text-[#002060]">MARS’ Got You!</span>
      </h2>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-8 sm:px-12 justify-items-center">
        {helpData.map((item) => (
          <div
            key={item.id}
            className="relative w-[300px] sm:w-[320px] md:w-[340px] bg-transparent"
          >
            {/* Image */}
            <div className="relative w-[90%] mx-auto h-[320px] rounded-3xl overflow-hidden shadow-md z-0">
              <img
                src={item.image}
                alt={item.titleMain}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlapping Info Block (Wider than image) */}
            <div className="bg-black text-white px-7 py-7 rounded-3xl relative -mt-10 w-[95%] sm:w-[100%] mx-auto shadow-lg z-10">
              <div className="text-2xl mb-3">{item.icon}</div>
              <p className="text-sm text-gray-300 mb-1">{item.titleTop}</p>
              <h3 className="text-xl font-bold leading-snug mb-2">
                {item.titleMain}
              </h3>
              <a
                href="#"
                className="inline-block mt-2 text-white border-b border-white hover:text-gray-300 transition"
              >
                {item.linkText}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarsHelpSection;
