import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { looksData } from "../Data/VideoSectionData";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function OwnThisLookSwiper() {
  const handleMouseEnter = (e) => e.target.play();
  const handleMouseLeave = (e) => {
    e.target.pause();
    e.target.currentTime = 0;
  };

  // Refs for custom navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="bg-white py-10 relative">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Own This Look!
        </h2>
        <p className="text-gray-500">Own The Latest Trends</p>
      </div>

      {/* Swiper Section */}
      <div className="px-4 sm:px-8 relative">
        {/* Custom Navigation Buttons */}
        <div
          ref={prevRef}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <FaArrowLeft className="text-black text-sm" />
        </div>
        <div
          ref={nextRef}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition"
        >
          <FaArrowRight className="text-black text-sm" />
        </div>

        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          modules={[Navigation]}
          loop={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
          className="mySwiper"
        >
          {looksData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-md group cursor-pointer">
                {/* Video */}
                <video
                  src={item.video}
                  muted
                  loop
                  playsInline
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="w-full h-130 object-cover transition-all duration-300 group-hover:scale-[1.02]"
                />

                {/* Product Info */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white p-3">
                  <h3 className="text-sm sm:text-base font-semibold truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300">{item.category}</p>
                  <p className="text-sm font-bold mt-1">{item.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
