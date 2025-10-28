import React from "react";
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

function Home() {
  return (
    <div className="w-full relative">
      <CategorySection />

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} inline-block h-[6px] w-[35px] bg-white/50 rounded-full mx-[6px] transition-all duration-300 ease-in-out"></span>`;
          },
        }}
        navigation={false}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper relative"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="flex flex-col items-center">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-96 md:h-[500px] object-cover"
            />
          </SwiperSlide>
        ))}
        <div className="custom-pagination absolute bottom-4 left-0 w-full flex justify-center items-center z-10"></div>
      </Swiper>
      <BestSellers />
      <GiftComboSection />
      <OffersSection />
      <PromoOfferSection />
      <VideoSection />
      <style>
        {`
          .swiper-pagination-bullet {
            border-radius: 9999px !important;
          }

          .swiper-pagination-bullet-active {
            width: 55px !important;
            background-color: #ec4899 !important; /* Tailwind pink-500 */
            height: 6px !important;
          }
        `}
      </style>
    </div>
  );
}

export default Home;
