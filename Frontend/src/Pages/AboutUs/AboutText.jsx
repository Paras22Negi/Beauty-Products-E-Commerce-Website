import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";


const AboutText = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // animate only once
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="bg-[#d4c4b0] w-screen mx-auto py-10 px-5 text-center">
      <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed" data-aos="fade-up" data-aos-delay="100">
        At MARS Cosmetics, we believe beauty is for everyone. From our humble
        beginnings to becoming India's most loved makeup brand, our journey has
        always been about empowering you. We create high- quality, accessible
        products that let you express your unique self with confidence and
        creativity. Together, we're redefining beauty standards — celebrating
        individuality in every shade, every style, and every story.
      </p>
    </div>
  );
};

export default AboutText;
