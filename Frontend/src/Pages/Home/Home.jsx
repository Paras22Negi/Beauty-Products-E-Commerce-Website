import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { slides } from "../Data/SlideData";

import CategorySection from "./CategorySection";
import BestSellers from "./BestSellers";
import GiftComboSection from "./GiftComboSection";
import OffersSection from "./OffersSection";
import PromoOfferSection from "./PromoOfferSection";
import VideoSection from "./VideoSection";
import MarsHelpSection from "./MarsHelpSection";
import JoinMarsParty from "./JoinMarsParty";

function Home() {

  const Navigate = useNavigate();
  const handleProductDetails = () => {
    // Logic to navigate to product details page
    // This can be implemented using useNavigate from react-router-dom
    Navigate('/ProductDetails/11'); // Example navigation to product with id 1
  };

  return (
    <div className="w-full relative">
      {/* Category Section */}
      <CategorySection />

      {/* Hero Swiper Slider */}
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} inline-block h-[5px] sm:h-[6px] w-[25px] sm:w-[35px] bg-white/60 rounded-full mx-[4px] transition-all duration-300 ease-in-out"></span>`;
          },
        }}
        navigation={false}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper relative cursor-pointer"
        onClick={handleProductDetails}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="flex flex-col items-center">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-[220px] sm:h-[320px] md:h-[450px] lg:h-[520px] object-cover"
            />
          </SwiperSlide>
        ))}
        <div className="custom-pagination absolute bottom-3 sm:bottom-4 left-0 w-full flex justify-center items-center z-10"></div>
      </Swiper>

      {/* Sections */}
      <BestSellers />
      <GiftComboSection />
      <OffersSection />
      <PromoOfferSection />
      <VideoSection />
      <MarsHelpSection />
      <JoinMarsParty />

      {/* Custom Swiper Styles */}
      <style>
        {`
          .swiper-pagination-bullet {
            border-radius: 9999px !important;
          }

          .swiper-pagination-bullet-active {
            width: 45px !important;
            background-color: #ec4899 !important; /* Tailwind pink-500 */
            height: 5px !important;
          }

          @media (min-width: 640px) {
            .swiper-pagination-bullet-active {
              width: 55px !important;
              height: 6px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
