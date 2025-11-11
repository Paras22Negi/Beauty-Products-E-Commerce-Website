import React from "react";

const ValuesSection = () => {
  const values = [
    {
      icon: "https://marscosmetics.in/cdn/shop/files/Group_77_366254b4-31c0-4776-a516-73594b3f5b63.png?v=1719589135&width=600",
      label: "Cruelty Free",
    },
    {
      icon: "https://marscosmetics.in/cdn/shop/files/Group_76_ef2bfa7e-cb10-4b06-a1e7-6f9c7f9e8206.png?v=1719589135&width=600",
      label: "Vegetarian",
    },
    {
      icon: "https://marscosmetics.in/cdn/shop/files/Group_75_8d87820b-0333-4928-bcb9-8f0ea50b515f.png?v=1719589135&width=600",
      label: "Easy to use",
    },
    {
      icon: "https://marscosmetics.in/cdn/shop/files/Group_74_994b973a-edf1-4bd8-a6aa-2753447a22bd.png?v=1719589135&width=600",
      label: "Designed in India",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#e8d5c4] to-[#d4c4b0] py-20 px-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
        {values.map((value, index) => (
          <div key={index} className="text-center">
            <div className="w-32 h-32 mx-auto mb-5 flex items-center justify-center">
              <img
                src={value.icon}
                alt={value.label}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {value.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValuesSection;
