import React from "react";
import Marquee from "react-fast-marquee";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


const MarqueeImages = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // animate only once
      easing: "ease-in-out",
    });
  }, []);

  const images = [
    {
      id: 1,
      alt: "Model with mascara",
      imgSrc:
        "https://marscosmetics.in/cdn/shop/files/00.png?v=1721453709&width=1380",
    },
    {
      id: 2,
      alt: "Model in pink dress",
      imgSrc:
        "https://marscosmetics.in/cdn/shop/files/Pore_cure.png?v=1721453709&width=1380",
    },
    {
      id: 3,
      alt: "Happy model with lipstick",
      imgSrc:
        "https://marscosmetics.in/cdn/shop/files/Popstar.png?v=1721453709&width=1380",
    },
    {
      id: 4,
      alt: "Model with lip gloss",
      imgSrc:
        "https://marscosmetics.in/cdn/shop/files/Candylicious.png?v=1721453709&width=1380",
    },
    {
      id: 5,
      alt: "Model with eye makeup",
      imgSrc:
        "https://marscosmetics.in/cdn/shop/files/High_Lash.png?v=1721453710&width=1380",
    },
    {
      id: 6,
      alt: "Model with lipstick",
      imgSrc:
        "https://marscosmetics.in/cdn/shop/files/Double_trouble.png?v=1721453709&width=1380",
    },
  ];

  return (
    <div className="bg-[#d4c4b0] py-8">
      <Marquee speed={50} gradient={false} pauseOnHover={false}>
        {images.map((image) => (
          <div
            key={image.id}
            className="flex-shrink-0 w-72 h-64 md:w-80 md:h-72 rounded-3xl overflow-hidden mx-2.5"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <img
              src={image.imgSrc}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default MarqueeImages;
