import React from "react";

const StatsSection = () => {
  const stats = [
    { number: "2015", label: "Our First Step" },
    { number: "Delhi", label: "Our Foundation" },
    { number: "27 million +", label: "Products sold in FY'24" },
    { number: "300 Cr. +", label: "Our FY'24 Turnover" },
  ];

  return (
    <section className="bg-gradient-to-br from-[#c84557] to-[#b83d4e] py-20 px-5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-10 text-[12rem] md:text-[15rem] font-bold whitespace-nowrap pointer-events-none select-none">
        makeup
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto relative z-10">
        {stats.map((stat, index) => (
          <div key={index} className="text-center text-white">
            <div className="text-4xl md:text-5xl font-bold mb-3">
              {stat.number}
            </div>
            <div className="text-lg opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
