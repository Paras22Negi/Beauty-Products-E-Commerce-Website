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
    <div className="w-full bg-gradient-to-r from-pink-700 to-pink-900 text-white px-4 py-2">
      <Marquee gradient={false} speed={150}>
        {ads.map((ad, index) => (
          <span
            key={index}
            onClick={addClicked}
            className="mx-8 cursor-pointer hover:underline hover:text-yellow-200 transition"
          >
            {ad}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export default AddsBar;
