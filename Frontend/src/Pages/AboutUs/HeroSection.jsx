import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // animate only once
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="bg-[#d4c4b0] py-16 h-45 px-5 text-center">
      <div data-aos="fade-down" data-aos-delay="100">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-black">
          MARS Cosmetics
        </h1>
        <p className="text-2xl text-gray-800">Makeup For Everyone</p>
      </div>
    </section>
  );
};

export default HeroSection;
