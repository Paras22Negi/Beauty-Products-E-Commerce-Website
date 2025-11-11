import React, { useEffect } from "react";
import HeroSection from "./HeroSection";
import MarqueeImages from "./MarqueeImages";
import AboutText from "./AboutText";
import StatsSection from "./StatsSection";
import BrandStatement from "./BrandStatement";
import OutlookSection from "./OutlookSection";
import ValuesSection from "./ValuesSection";

// ✅ Import AOS (Animate On Scroll)
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  // ✅ Initialize AOS on mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in ms
      easing: "ease-in-out",
      once: true, // animate only once per load
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div data-aos="fade-right">
        <HeroSection />
      </div>
      <div data-aos="fade-left" data-aos-delay="100">
        <MarqueeImages />
      </div>
      <div data-aos="fade-right" data-aos-delay="200">
        <AboutText />
      </div>
      <div data-aos="zoom-out" data-aos-delay="300">
        <StatsSection />
      </div>
      <div data-aos="fade-right" data-aos-delay="400">
        <BrandStatement />
      </div>
      <div data-aos="fade-left" data-aos-delay="500">
        <OutlookSection />
      </div>
      <div data-aos="fade-up" data-aos-delay="600">
        <ValuesSection />
      </div>
    </div>
  );
};

export default AboutUs;
