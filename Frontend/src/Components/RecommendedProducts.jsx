import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecommendedProducts = ({ products }) => {
  return (
    <div className="my-14 px-4">
      <h2 className="text-2xl font-bold mb-6">Recommended Products</h2>
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        slidesPerView={4}
        loop
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {products?.map((item) => {
          const originalPrice = item.price;
          const discount = item.discountPersent || item.discountPercentage || 0;
          const discountedPrice =
            item.discountedPrice ||
            (item.price * (1 - discount / 100)).toFixed(0);
          const reviewCount = item.reviews?.length || 0;

          return (
            <SwiperSlide key={item._id}>
              <Link
                to={`/productDetails/${item._id}`}
                className="bg-[#f5f5f5] rounded-lg p-4 shadow-sm block"
              >
                {/* IMAGE BOX */}
                <div className="bg-white rounded-lg flex justify-center items-center h-72 w-full mb-3 overflow-hidden">
                  <img
                    src={
                      item.thumbnail ||
                      item.imageUrl?.[0] ||
                      item.images?.[0] ||
                      ""
                    }
                    alt={item.title}
                    className="object-contain h-60 w-full hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* TITLE */}
                <h3 className="mt-2 font-medium text-base">{item.title}</h3>

                {/* RATING */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400 text-xs">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                  <p className="text-gray-500 text-xs">
                    {reviewCount > 0
                      ? `${reviewCount} review${reviewCount > 1 ? "s" : ""}`
                      : "No review"}
                  </p>
                </div>

                {/* PRICE SECTION */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-red-600 font-bold text-lg">
                    Rs. {discountedPrice}
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="line-through text-gray-400 text-sm">
                        Rs. {originalPrice}
                      </span>
                      <span className="text-red-500 text-xs text-nowrap">
                        | {Math.round(discount)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* ADD TO BAG BUTTON */}
                <button
                  className="mt-4 bg-black text-white py-3 rounded-lg w-full text-base font-medium hover:bg-gray-900 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    // Additional logic if needed
                  }}
                >
                  Add to bag
                </button>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default RecommendedProducts;
