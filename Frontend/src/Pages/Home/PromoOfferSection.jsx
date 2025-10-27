import React from "react";

function PromoOfferSection({
  title = "Who doesn’t love a free gift?",
  description = "Get a free 15 Color Eyeshadow Palette worth Rs.449 on purchase above Rs.999*",
  code = "BIGBASHSALE",
  buttonText = "Get yours now!",
  image = "https://marscosmetics.in/cdn/shop/files/Untitled-2_7b56e80e-03e2-4e66-99ac-9b7954d423f7.png?v=1728106133&width=1000",
  bgColor = "#f3f3f3",
}) {
  return (
    <section
      className="rounded-3xl mx-6 my-10 px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20"
      style={{ backgroundColor: bgColor }}
    >
      {/* Left Text Section */}
      <div className="flex flex-col text-left md:w-1/2">
        <h2 className="text-4xl md:text-6xl font-bold text-black leading-tight mb-6">
          {title}
        </h2>

        <p className="text-lg text-gray-800 mb-4">{description}</p>

        <p className="text-lg font-medium text-black mb-8">
          Use Code: <span className="font-bold">{code}</span>
        </p>

        <button className="bg-black text-white font-medium px-6 py-3 rounded-md w-fit hover:bg-gray-800 transition">
          {buttonText}
        </button>
      </div>

      {/* Right Image Section */}
      <div className="relative md:w-1/2 flex justify-center">
        <img
          src={image}
          alt="Offer"
          className="w-[90%] md:w-[80%] object-contain rotate-[-10deg] md:rotate-[-15deg] drop-shadow-2xl"
        />
      </div>
    </section>
  );
}

export default PromoOfferSection;
