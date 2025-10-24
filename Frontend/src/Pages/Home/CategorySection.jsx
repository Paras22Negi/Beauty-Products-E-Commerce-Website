import React from "react";
import { categories } from "../Data/CategorySectionData";

function CategorySection() {
  return (
    <div className="bg-black text-white py-5">
      <div className="flex overflow-x-auto justify-center gap-6 px-3 scrollbar-hide">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex flex-col items-center group relative w-24 sm:w-28"
          >
            <div className="relative">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-2 border-pink-600 transition-transform duration-300 group-hover:scale-103"
              />
              {cat.badge && (
                <span className="absolute top-1 left-1 bg-pink-600 text-white text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
                  {cat.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs sm:text-sm font-medium group-hover:text-pink-400 text-center">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
