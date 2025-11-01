import React from "react";
import Marquee from "react-fast-marquee";

const ads = [
  "🚀 Free shipping on orders above ₹999! Grab your favorites now!",
  "💄 New arrivals in Cosmetics are here – Shop the latest trends!",
  "🎁 Special discount: Get 10% off using code MARS10!",
  "🌟 Limited edition sets available now – don’t miss out!",
];

const addClicked = () => {
  alert("Ad clicked! Visit our store for more details.");
};

function AddsBar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-red-700 to-red-900 text-white text-sm sm:text-base font-medium py-3 sm:py-2.5 z-[120]">
      <Marquee gradient={false} speed={80}>
        {ads.map((ad, index) => (
          <span
            key={index}
            onClick={addClicked}
            className="mx-8 cursor-pointer hover:underline hover:text-yellow-200 transition whitespace-nowrap"
          >
            {ad}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default AddsBar;
