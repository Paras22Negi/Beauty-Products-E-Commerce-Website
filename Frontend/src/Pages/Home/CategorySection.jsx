import React from "react";
import { categories } from "../Data/CategorySectionData";
import { useNavigate } from "react-router-dom";

function CategorySection() {

    const Navigate = useNavigate();
    const handleProducts = () => {
      Navigate("/products");
    };

  return (
    <div className="bg-black text-white py-6 px-3 sm:px-6 lg:px-10 overflow-hidden">
      <div
        className="
          flex overflow-x-auto lg:overflow-visible justify-start lg:justify-center 
          gap-4 sm:gap-6 md:gap-8 scroll-smooth snap-x snap-mandatory
          scrollbar-hide
        "
      >
        {categories.map((cat, index) => (
          <div
            key={index}
            className="
              flex flex-col items-center group relative 
              w-20 sm:w-24 md:w-28 snap-start flex-shrink-0
            "
          >
            {/* Category Image */}
            <div className="relative" onClick={handleProducts}>
              <img
                src={cat.img}
                alt={cat.name}
                className="
                  w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
                  object-cover rounded-full border-2 border-pink-600 
                  transition-transform duration-300 group-hover:scale-105
                "
              />
              {cat.badge && (
                <span
                  className="
                    absolute top-1 left-1 bg-pink-600 text-white 
                    text-[9px] sm:text-[10px] px-1.5 py-[1px] 
                    rounded-full font-semibold
                  "
                >
                  {cat.badge}
                </span>
              )}
            </div>

            {/* Category Name */}
            <p
              className="
                mt-2 text-[10px] sm:text-xs md:text-sm font-medium 
                group-hover:text-pink-400 text-center whitespace-nowrap
              "
            >
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategorySection;
