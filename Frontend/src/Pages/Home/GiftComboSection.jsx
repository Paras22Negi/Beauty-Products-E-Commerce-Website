import React from "react";
import { giftCombos } from "../Data/GiftComboData";

function GiftComboSection() {
  return (
    <div className="bg-gray-100 py-12 sm:py-14 flex flex-col items-center px-4 sm:px-6 lg:px-10">
      {/* Section Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center mb-8 sm:mb-10">
        Explore Gifts & Combos
      </h2>

      {/* Card Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl">
        {giftCombos.map((combo, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={combo.image}
                alt={combo.title}
                className="w-full h-[280px] sm:h-[360px] md:h-[430px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title Bar */}
            <div className="bg-black text-white text-center py-3 sm:py-4 font-semibold text-base sm:text-lg md:text-xl cursor-pointer hover:bg-red-950 transition-colors duration-300">
              {combo.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GiftComboSection;
