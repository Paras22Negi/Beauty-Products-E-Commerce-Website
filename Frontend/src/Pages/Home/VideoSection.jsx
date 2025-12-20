import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Play, X, Loader2 } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProduct } from "../../redux/Product/action";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function OwnThisLookSwiper() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch products for "Bestsellers" section in modal
  const { products } = useSelector((store) => store.product);

  useEffect(() => {
    dispatch(fetchProduct());
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/videos`);
        setVideos(res.data.videos);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [dispatch]);

  const handleMouseEnter = (e) => e.target.play();
  const handleMouseLeave = (e) => {
    e.target.pause();
    e.target.currentTime = 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (videos.length === 0) return null;

  // Filter/Sort products for bestsellers (taking first 5 for now)
  const recommendedProducts = products?.slice(0, 5) || [];

  return (
    <>
      <div className="bg-white py-10 relative">
        {/* Heading */}
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            Own This Look!
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Own The Latest Trends
          </p>
        </div>

        {/* Swiper Section */}
        <div className="px-3 sm:px-8 relative max-w-[90rem] mx-auto">
          {/* Custom Navigation Buttons */}
          <div
            ref={prevRef}
            className="absolute left-1 sm:left-3 md:left-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-lg w-10 h-10 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100"
          >
            <ChevronLeft className="text-gray-800 w-5 h-5" />
          </div>
          <div
            ref={nextRef}
            className="absolute right-1 sm:right-3 md:right-4 top-1/2 z-10 -translate-y-1/2 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full shadow-lg w-10 h-10 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100"
          >
            <ChevronRight className="text-gray-800 w-5 h-5" />
          </div>

          {/* Swiper */}
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            modules={[Navigation]}
            loop={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              480: { slidesPerView: 1.5, spaceBetween: 15 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 25 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
              1280: { slidesPerView: 5, spaceBetween: 35 },
            }}
            className="mySwiper !pb-10 !px-1" // Add padding for shadow visibility
          >
            {videos.map((item) => (
              <SwiperSlide key={item._id}>
                <div
                  onClick={() => setSelectedVideo(item)}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-md group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  {/* Video Thumbnail/Preview */}
                  <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] bg-black">
                    <video
                      src={item.url}
                      muted
                      loop
                      playsInline
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-lg">
                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Split Screen Video Modal - Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
              onClick={() => setSelectedVideo(null)}
            >
              {/* Complete Modal Wrapper */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row w-fit max-w-[95vw] lg:max-w-5xl max-h-[90vh] mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Side - Video */}
                <div className="relative shrink-0 w-full lg:w-auto flex items-center justify-center bg-zinc-900">
                  <video
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-[40vh] sm:h-[50vh] lg:h-[80vh] lg:w-auto object-contain"
                    style={{ aspectRatio: "9/16" }}
                  />
                  {/* Title overlay on video (optional, can be removed if cleaner look desired) */}
                  {/* <div className="absolute top-4 left-4 text-white/50 text-xs">venusgarments.in</div> */}
                </div>

                {/* Right Side - Info & Keep Shopping */}
                <div className="flex flex-col w-full lg:w-[400px] bg-white overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#DFF200] to-[#CBE600] flex items-center justify-center shadow-sm text-xs font-bold text-[#111111]">
                        VG
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block text-sm">
                          venusgarments
                        </span>
                        <span className="text-xs text-gray-500">
                          Venus Garments
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable Content Area */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                    {/* Caption/Description */}
                    <div className="mb-6">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedVideo.description ||
                          "Discover our latest collection! Premium quality, trendy designs at best prices 🛍️✨"}
                      </p>
                    </div>

                    {/* Bestsellers Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900">
                          Shop the Look
                        </h3>
                        <button
                          onClick={() => {
                            setSelectedVideo(null);
                            navigate("/bestseller");
                          }}
                          className="text-xs text-[#8A6F4F] font-medium hover:underline"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-3">
                        {loading && products.length === 0 ? (
                          <div className="text-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                          </div>
                        ) : recommendedProducts.length > 0 ? (
                          recommendedProducts.map((product) => (
                            <div
                              key={product._id}
                              onClick={() => {
                                setSelectedVideo(null);
                                navigate(`/productDetails/${product._id}`);
                              }}
                              className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#CBE600] hover:shadow-md transition-all cursor-pointer group bg-white"
                            >
                              <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={
                                    product.imageUrl?.[0] ||
                                    product.image ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#8A6F4F] transition-colors">
                                  {product.title}
                                </h4>
                                <p className="text-xs text-gray-500 capitalize mt-0.5">
                                  {product.category?.name || "Fashion"}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900">
                                    ₹{product.discountedPrice || product.price}
                                  </span>
                                  {product.discountedPrice &&
                                    product.discountedPrice < product.price && (
                                      <span className="text-xs text-gray-400 line-through">
                                        ₹{product.price}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-gray-400 text-xs py-4">
                            No products found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
