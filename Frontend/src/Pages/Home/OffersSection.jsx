import React from "react";
import { offers } from "../Data/OfferData";
import { useNavigate } from "react-router-dom";

function OffersSection() {
  const navigate = useNavigate();
  const handleExploreClick = () => {
    navigate("/products");
  }
  return (
    <div className="bg-white py-10 sm:py-12 md:py-16">
      {/* Heading */}
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-black px-4">
        Curated Offers For You
      </h2>

      {/* Offers */}
      <div className="flex overflow-x-auto gap-6 sm:gap-8 px-4 sm:px-8 scrollbar-hide">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-[250px] sm:w-[300px] md:w-[340px] rounded-2xl overflow-visible bg-white"
          >
            {/* Image */}
            <div className="relative flex justify-center">
              <div className="w-[220px] sm:w-[260px] md:w-[280px] h-[260px] sm:h-[300px] md:h-[320px] rounded-t-2xl overflow-hidden shadow-md">
                <img
                  src={offer.img}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gradient Fade */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] md:w-[280px] h-10 sm:h-12 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Text Block */}
            <div className="bg-black text-white px-5 sm:px-6 pb-6 pt-4 sm:pt-5 flex flex-col justify-between h-[180px] sm:h-[200px] md:h-[220px] w-[240px] sm:w-[270px] md:w-[300px] rounded-3xl relative -mt-8 mx-auto shadow-lg z-10">
              <div>
                <p className="text-xs sm:text-sm text-gray-300 mb-1">
                  Apply code{" "}
                  <span className="font-semibold text-white">
                    '{offer.code}'
                  </span>
                </p>
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-snug mb-2 line-clamp-2">
                  {offer.title}
                </h3>
                {offer.condition && (
                  <p className="text-xs sm:text-sm md:text-base font-medium text-gray-200 line-clamp-1">
                    {offer.condition}
                  </p>
                )}
              </div>

              <button className="mt-3 sm:mt-4 text-white underline font-medium cursor-pointer self-start"
              onClick={handleExploreClick}
              >
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OffersSection;
