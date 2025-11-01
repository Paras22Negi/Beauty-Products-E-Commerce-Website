import React from "react";

function JoinMarsParty() {
  return (
    <div className="flex items-center justify-center bg-[#f3f4f6] px-4 sm:px-6 py-10 sm:py-14">
      <div className="bg-[#e9ecef] flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-10 lg:gap-20 rounded-3xl max-w-[90rem] w-full mx-auto p-6 sm:p-10 shadow-sm">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://marscosmetics.in/cdn/shop/files/Untitled-1_20255f4e-2848-43d4-863c-6c659316862b.jpg?v=1721371847&width=1000"
            alt="Join the MARS Party"
            className="rounded-3xl w-full max-w-sm sm:max-w-md lg:max-w-full object-cover"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4 sm:space-y-6 px-2 sm:px-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0a1a33] leading-tight">
            Join the <br className="hidden sm:block" /> MARS Party!
          </h2>

          <p className="text-gray-800 text-sm sm:text-base md:text-lg font-semibold">
            Subscribe to get a discount of{" "}
            <span className="font-bold">15%</span> on your first order.{" "}
            <span className="font-bold">Exclusively for You.</span>
          </p>

          {/* Email Input + Button */}
          <div className="flex flex-col sm:flex-row items-center w-full max-w-md gap-3 sm:gap-0 sm:border sm:border-gray-400 sm:rounded-md overflow-hidden font-semibold mx-auto lg:mx-0">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 w-full px-4 py-3 border border-gray-400 sm:border-0 text-gray-700 placeholder-gray-600 font-semibold focus:outline-none text-sm sm:text-base"
            />
            <button className="bg-black text-white px-6 py-3 text-sm sm:text-base font-bold hover:bg-gray-800 w-full sm:w-auto transition-all duration-300">
              Subscribe
            </button>
          </div>

          <p className="text-gray-700 text-xs sm:text-sm font-semibold leading-relaxed">
            Sign up for fab updates from MARS Cosmetics. Standard rates apply.{" "}
            <br className="hidden sm:block" />
            Read our{" "}
            <a href="#" className="underline font-bold hover:text-pink-600">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline font-bold hover:text-pink-600">
              Privacy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default JoinMarsParty;
