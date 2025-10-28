import React from "react";

function JoinMarsParty() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] px-6 py-10">
      <div className="bg-[#e9ecef] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 rounded-3xl max-w-[90rem] w-full mx-auto p-10 shadow-sm">
        {/* Left Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://marscosmetics.in/cdn/shop/files/Untitled-1_20255f4e-2848-43d4-863c-6c659316862b.jpg?v=1721371847&width=1000"
            alt="Join the MARS Party"
            className="rounded-3xl w-[90%] max-w-md lg:max-w-full object-cover"
          />
        </div>

        {/* Right Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5">
          <h2 className="text-4xl font-extrabold text-[#0a1a33] leading-tight">
            Join the <br /> MARS Party!
          </h2>
          <p className="text-gray-800 text-base font-semibold">
            Subscribe to get discount of <span className="font-bold">15%</span>{" "}
            on your first order.{" "}
            <span className="font-bold">Exclusively for You.</span>
          </p>

          {/* Email Input + Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:border sm:border-gray-400 sm:rounded-md overflow-hidden max-w-md font-semibold">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="flex-1 w-full px-4 py-3 border border-gray-400 sm:border-0 text-gray-700 placeholder-gray-600 font-semibold focus:outline-none"
            />
            <button className="bg-black text-white px-6 py-3 font-bold hover:bg-gray-800 w-full sm:w-auto">
              Subscribe
            </button>
          </div>

          <p className="text-gray-700 text-sm font-semibold">
            Sign up for fab updates from MARS Cosmetics. Standard rates apply.{" "}
            <br />
            Read our{" "}
            <a href="#" className="underline font-bold">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline font-bold">
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
