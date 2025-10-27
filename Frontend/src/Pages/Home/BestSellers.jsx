import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { bestSellersData } from "../Data/bestSellersData";

function BestSellers() {
  const [activeCategory, setActiveCategory] = useState("Lips");
  const products = bestSellersData[activeCategory];

  return (
    <div className="bg-gray-50 py-10">
      {/* Category Tabs */}
      <div className="flex justify-center gap-8 mb-6">
        {Object.keys(bestSellersData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-lg font-medium pb-2 transition-all duration-300 ${
              activeCategory === category
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Swiper Section */}
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={4}
        spaceBetween={25}
        navigation
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} inline-block h-[2px] w-[30px] bg-gray-300 rounded transition-all duration-300 ease-in-out mx-1"></span>`;
          },
        }}
        className="px-8"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className="group bg-white rounded-xl shadow-sm border border-gray-100 p-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
              {/* Product Image */}
              <div className="relative overflow-hidden h-[280px] flex items-center justify-center rounded-md">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-auto object-contain transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
                />
                <img
                  src={product.image2}
                  alt={product.title}
                  className="h-full w-auto object-contain absolute top-0 left-1/2 -translate-x-1/2 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                />
                {product.label && (
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold text-white px-2 py-1 rounded ${
                      product.label === "New" ? "bg-pink-600" : "bg-red-500"
                    }`}
                  >
                    {product.label}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="mt-3 text-left">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {product.title}
                </h3>

                {/* Rating & Reviews */}
                <div className="text-yellow-500 my-1">
                  {"★".repeat(product.rating)}{" "}
                  <span className="text-gray-400 text-sm">
                    {product.reviews}
                  </span>
                </div>

                {/* Price & Offer */}
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">
                    {product.price}
                    {product.oldPrice && (
                      <span className="line-through text-gray-400 text-sm ml-2">
                        {product.oldPrice}
                      </span>
                    )}
                  </p>
                  {product.offer && (
                    <p className="text-green-600 text-xs font-semibold">
                      {product.offer}
                    </p>
                  )}
                </div>

                {/* Shades */}
                <div className="flex gap-2 mt-2">
                  {product.shades.map((shade, i) => (
                    <span
                      key={i}
                      className="h-4 w-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: shade }}
                    ></span>
                  ))}
                </div>

                {/* Show More Button */}
                <button className="mt-4 w-full bg-black text-white text-sm py-2 rounded-md transition-all duration-300 hover:bg-gray-800">
                  Show More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Pagination */}
      <div className="custom-pagination mt-8 flex justify-center"></div>
    </div>
  );
}

export default BestSellers;
