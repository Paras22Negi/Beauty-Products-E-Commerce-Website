import React from "react";
import { giftCombos } from "../Data/GiftComboData";

function GiftComboSection() {
  return (
    <div className="bg-gray-100 py-14 flex flex-col items-center">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-10">
        Explore Gifts & Combos
      </h2>

      {/* Card Container */}
      <div className="flex flex-col sm:flex-row gap-8 justify-center w-full max-w-7xl px-6">
        {giftCombos.map((combo, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-1/3"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={combo.image}
                alt={combo.title}
                className="w-full h-[430px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title Bar */}
            <div className="bg-black text-white text-center py-4 font-semibold text-xl cursor-pointer hover:bg-red-950 transition-colors duration-300">
              {combo.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GiftComboSection;
