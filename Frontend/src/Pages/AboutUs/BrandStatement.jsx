import React from "react";

const BrandStatement = () => {
  return (
    <div>
      <img
        src="https://marscosmetics.in/cdn/shop/files/Artboard_2_20c741df-bd2b-4b0f-93bf-4d86a20cb51e.jpg?v=1721453929&width=1800"
        alt=""
      />
      <section className="bg-black text-white py-20 px-5 text-center">
        <h2 className="text-sm md:text-base mb-5 opacity-80 uppercase tracking-wider">
          Our Brand Statement
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-8">
          Makeup for Everyone
        </h3>
        <p className="max-w-4xl mx-auto text-lg md:text-xl leading-relaxed">
          At MARS, beauty has no labels, limits, or stereotypes. Our DNA is
          rooted in celebrating diversity and empowering self-expression —
          making sure everyone feels seen, valued, and free to be themselves.
          Inclusivity isn't a checkbox for us; it's the very fabric of who we
          are. With bold ideas and accessible beauty, we're redefining what it
          means to feel confident, creative, and unapologetically you.
        </p>
      </section>
    </div>
  );
};

export default BrandStatement;
