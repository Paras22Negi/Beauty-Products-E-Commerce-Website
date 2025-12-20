import React, { useState } from "react";

const BlogHeroImage = ({ blog }) => {
  const images = blog.allImages || [blog.image];
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="mb-8">
      {/* Main Hero Image */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl transition-all duration-500 ease-in-out">
        <div className="absolute inset-0 bg-black/30"></div>
        <img
          src={selectedImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center leading-tight drop-shadow-lg">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === img
                  ? "border-black scale-105 shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogHeroImage;
