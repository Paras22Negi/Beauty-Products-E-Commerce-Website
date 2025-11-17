import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  FaStar,
  FaHeart,
  FaShareAlt,
  FaGift,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { fetchProductDetail, fetchProduct } from "../redux/Product/action";
import { addToCart } from "../redux/cart/action";
import RecommendedProducts from "../Components/RecommendedProducts";
import ShowcaseStyle from "../Components/ShowcaseStyle";
import ProductReviews from "../Components/ProductReviews";


function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [selectedShade, setSelectedShade] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const myVideos = [
    {
      id: 1,
      videoUrl:
        "https://cevoidcontent.com/videos/YEnSF69oYv8yRDdPjQuAK/original.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=600&fit=crop",
      username: "reachedmars",
    },
    {
      id: 2,
      videoUrl:
        "https://cevoidcontent.com/videos/ktAH7qJxouXb0qQsh62Ft/original.mp4",
      thumbnail:
        "https://cevoidcontent.com/videos/ktAH7qJxouXb0qQsh62Ft/thumbnail.jpeg?class=480",
      username: "reachedmars",
    },
    {
      id: 3,
      videoUrl:
        "https://cevoidcontent.com/videos/JB4tYaHU-qhZJFK8LF6BL/original.mp4",
      thumbnail:
        "https://cevoidcontent.com/videos/JB4tYaHU-qhZJFK8LF6BL/thumbnail.jpeg?class=480",
      username: "reachedmars",
    },
    {
      id: 4,
      videoUrl:
        "https://cevoidcontent.com/videos/yWtrDpvWi8isXLCJ1gUQA/original.mp4",
      thumbnail:
        "https://cevoidcontent.com/videos/yWtrDpvWi8isXLCJ1gUQA/thumbnail.jpeg?class=480",
      username: "reachedmars",
    },
    {
      id: 5,
      videoUrl:
        "https://cevoidcontent.com/videos/HY3TR8QpN9xsYDP91nlV4/original.mp4",
      thumbnail:
        "https://cevoidcontent.com/videos/HY3TR8QpN9xsYDP91nlV4/thumbnail.jpeg?class=480",
      username: "reachedmars",
    },
  ];

  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, productDetail, product } = useSelector(
    (state) => state.product
  );
  console.log(product);

  const recommended = product
    .filter((p) => p.id !== productDetail.id)
    .slice(0, 6);

  useEffect(() => {
    dispatch(fetchProductDetail(id));
    dispatch(fetchProduct());
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#e11d48" size={50} />
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 font-semibold mt-10">{error}</p>
    );

  const handleAddToCart = () => {
    const shades = [
      "01 Leading Lady",
      "02 Berry Bliss",
      "03 Coral Dreams",
      "04 Nude Elegance",
    ];
    dispatch(addToCart(productDetail, quantity, shades[selectedShade]));
    alert("Product added to cart!");
  };

  const shadeColors = [
    "#b56a63",
    "#813b3b",
    "#a46346",
    "#d68574",
    "#e07d85",
    "#c44534",
    "#7a2f3b",
    "#a34760",
  ];

  const handleImgChange = (img) => {
    setImgLoading(true);
    setSelectedImage(img);
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-screen bg-[#f9fafb] py-10 px-4 sm:px-6">
      <div className="w-[95%] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* === MAIN SECTION === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
          {/* LEFT - STICKY IMAGES */}
          <div className="flex flex-col items-center justify-center lg:sticky lg:top-10 lg:h-screen">
            <div className="relative w-full flex justify-center items-center">
              {imgLoading && (
                <div className="absolute flex justify-center items-center w-[420px] h-[420px] bg-white/60 rounded-xl z-10">
                  <ClipLoader color="#e11d48" size={40} />
                </div>
              )}
              <img
                src={selectedImage || productDetail.thumbnail}
                alt={productDetail.title}
                className="w-[420px] h-[420px] object-contain rounded-xl"
                onLoad={() => setImgLoading(false)}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {productDetail.images?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${productDetail.title}-${index}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                    selectedImage === img
                      ? "border-rose-600 scale-105"
                      : "border-gray-300 hover:border-rose-500"
                  }`}
                  onClick={() => handleImgChange(img)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT - SCROLLABLE DETAILS */}
          <div className="flex flex-col lg:h-screen lg:overflow-y-auto lg:pr-4">
            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                  {productDetail.title ||
                    "Mars Matte Lipstick - 01 Leading Lady"}
                </h1>

                <div className="flex gap-2">
                  <button className="text-gray-600 hover:text-rose-600 bg-gray-100 p-2 rounded-full">
                    <FaHeart />
                  </button>
                  <button className="text-gray-600 hover:text-rose-600 bg-gray-100 p-2 rounded-full">
                    <FaShareAlt />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex text-yellow-400">
                  {[...Array(Math.round(productDetail.rating || 4))].map(
                    (_, i) => (
                      <FaStar key={i} />
                    )
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {productDetail.reviews?.length || 50} Ratings & Reviews
                </p>
              </div>

              <div className="mt-4">
                <p className="text-3xl font-bold text-gray-900">
                  ₹{productDetail.price || 299}
                </p>
                <p className="text-sm text-gray-600">
                  MRP:{" "}
                  <span className="line-through text-gray-400">
                    ₹{productDetail.oldPrice || 499}
                  </span>{" "}
                  <span className="text-green-600 font-medium">
                    ({productDetail.discountPercentage || 30}% OFF)
                  </span>
                </p>
              </div>

              {/* Color Swatches */}
              <div className="mt-5">
                <p className="text-gray-700 font-semibold mb-2">Shade:</p>
                <div className="flex flex-wrap gap-2">
                  {shadeColors.map((color, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedShade(i)}
                      className={`w-9 h-9 rounded-full border-2 cursor-pointer transition ${
                        selectedShade === i
                          ? "border-gray-800 scale-110"
                          : "border-gray-300 hover:border-gray-500"
                      }`}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5">
                <p className="text-gray-700 font-semibold mb-2">Quantity:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 bg-gray-100 rounded-lg font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  ADD TO CART
                </button>
                <button className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition">
                  BUY NOW
                </button>
              </div>

              {/* Offer */}
              <div className="mt-6 bg-rose-50 p-4 rounded-lg border border-rose-200 flex items-center gap-3">
                <FaGift className="text-rose-600 text-xl" />
                <p className="text-gray-700 text-sm">
                  Get a free gift worth ₹449 on orders above ₹999. Use code{" "}
                  <span className="font-semibold text-rose-600">
                    BIGBASHSALE
                  </span>
                </p>
              </div>
            </div>

            {/* Accordion Sections - Now inside right column */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              {[
                {
                  title: "Product Description",
                  content:
                    "The Mars Matte Lipstick delivers a bold, long-lasting matte finish with a creamy, comfortable texture. Infused with nourishing ingredients, it keeps your lips soft and hydrated while offering intense pigmentation.",
                },
                {
                  title: "Ingredients",
                  content:
                    "Contains Vitamin E, Shea Butter, and natural waxes that help moisturize and protect your lips while maintaining the matte effect.",
                },
                {
                  title: "How to Use",
                  content:
                    "Apply directly on the lips starting from the center and moving outward. For a bold look, apply two layers. Use a lip liner for precise edges.",
                },
                {
                  title: "Offers & Promotions",
                  content:
                    "Get a free beauty pouch on purchases above ₹799. Flat 10% off on your first order with code MARS10.",
                },
              ].map((section, index) => (
                <div key={index} className="border-b border-gray-200 py-4">
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <h2 className="text-lg font-semibold text-gray-800">
                      {section.title}
                    </h2>
                    {openSection === section.title ? (
                      <FaChevronUp className="text-gray-600" />
                    ) : (
                      <FaChevronDown className="text-gray-600" />
                    )}
                  </button>

                  <div
                    className={`transition-all overflow-hidden duration-500 ${
                      openSection === section.title
                        ? "max-h-96 mt-2"
                        : "max-h-0"
                    }`}
                  >
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <RecommendedProducts products={recommended} />\
      <ShowcaseStyle videos={myVideos} />
      <ProductReviews
        reviews={productDetail.reviews}
        rating={productDetail.rating}
      />
    </div>
  );
}

export default ProductDetails;
