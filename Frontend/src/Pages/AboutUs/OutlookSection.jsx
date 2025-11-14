import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const OutlookSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true, // animate only once
      easing: "ease-in-out",
    });
  }, []);

  const outlooks = [
    {
      title: "Boldly Positive",
      description:
        "We believe beauty should uplift. Every lipstick, every eyeliner, every small step can spark confidence and joy.",
    },
    {
      title: "Fearlessly Creative",
      description:
        "Makeup is about expression, not rules. We experiment, we play, and we inspire you to find your own unique style.",
    },
    {
      title: "Power in Your Hands",
      description:
        "We don't just sell makeup — we give you the tools to own your look, your story, and your confidence every single day.",
    },
    {
      title: "Always Mindful",
      description:
        "We stay grounded in the realities of our industry, trends, and community — evolving responsibly while creating beauty that lasts.",
    },
  ];

  return (
    <section className="bg-gradient-to-br w-screen from-[#c84557] to-[#b83d4e] py-20 px-5 text-white text-center">
      <div data-aos="fade-up" data-aos-delay="100">
        <h2 className="text-xl md:text-2xl mb-3 opacity-90">
          This Is Our Outlook
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-16">
          Boldly Positive. Fearlessly Creative. Power In Your Hands. Always
          Mindful
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {outlooks.map((outlook, index) => (
            <div
              key={index}
              className="bg-[#f5e6d3] text-black p-8 rounded-2xl text-left"
            >
              <h4 className="text-2xl font-bold mb-5">{outlook.title}</h4>
              <p className="text-base leading-relaxed">{outlook.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutlookSection;
