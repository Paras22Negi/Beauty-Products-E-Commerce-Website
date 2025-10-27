import React from "react";
import { offers } from "../Data/OfferData";

function OffersSection() {
  return (
    <div className="bg-white py-12">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold mb-10 text-black">
        Curated Offers For You
      </h2>

      {/* Offers */}
      <div className="flex overflow-x-auto gap-8 px-8 scrollbar-hide">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="relative w-[340px] flex-shrink-0 rounded-2xl overflow-visible bg-white"
          >
            {/* Image (slightly larger and centered) */}
            <div className="relative flex justify-center">
              <div className="w-[280px] h-[320px] rounded-t-2xl overflow-hidden shadow-md">
                <img
                  src={offer.img}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Smooth fade overlap */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[280px] h-12 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* Text Block (bigger, rounded, overlapping the image) */}
            <div className="bg-black text-white px-6 pb-6 pt-5 flex flex-col justify-between h-[220px] w-[300px] rounded-3xl relative -mt-8 mx-auto shadow-lg z-10">
              <div>
                <p className="text-sm text-gray-300 mb-1">
                  Apply code{" "}
                  <span className="font-semibold text-white">
                    '{offer.code}'
                  </span>
                </p>
                <h3 className="text-xl font-bold leading-snug mb-2 line-clamp-2">
                  {offer.title}
                </h3>
                {offer.condition && (
                  <p className="text-base font-medium text-gray-200 line-clamp-1">
                    {offer.condition}
                  </p>
                )}
              </div>

              <button className="mt-4 text-white underline font-medium self-start">
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
