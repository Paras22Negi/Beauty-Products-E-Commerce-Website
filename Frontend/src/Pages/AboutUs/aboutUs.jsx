import React from "react";
import HeroSection from "./HeroSection";
import MarqueeImages from "./MarqueeImages";
import AboutText from "./AboutText";
import StatsSection from "./StatsSection";
import BrandStatement from "./BrandStatement";
import OutlookSection from "./OutlookSection";
import ValuesSection from "./ValuesSection";

const AboutUs = () => {
  return (
    <div className=" min-h-screen">
      <HeroSection />
      <MarqueeImages />
      <AboutText />
      <StatsSection />
      <BrandStatement />
      <OutlookSection />
      <ValuesSection />
    </div>
  );
};

export default AboutUs;
