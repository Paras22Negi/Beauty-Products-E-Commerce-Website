import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { fetchProduct, searchProduct } from "../redux/Product/action";
import { ClipLoader } from "react-spinners";
import { FaStar } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

function ProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, product } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [openSections, setOpenSections] = useState({
    availability: false,
    price: false,
    color: false,
    productType: false,
  });

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const minPrice = 0;
  const maxPrice = 10000;

  // Filter states
  const [filters, setFilters] = useState({
    availability: {
      inStock: false,
      outOfStock: false,
    },
    colors: [],
    productTypes: [],
  });

  // Sort state
  const [sortBy, setSortBy] = useState("featured");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const query = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    if (query) {
      dispatch(searchProduct(query));
    } else {
      dispatch(fetchProduct());
    }
  }, [dispatch, query]);

  const productsArray = Array.isArray(product)
    ? product
    : product?.products || [];

  // Filter Logic
  const getFilteredProducts = () => {
    let filtered = [...productsArray];

    // Filter by availability
    if (filters.availability.inStock && !filters.availability.outOfStock) {
      filtered = filtered.filter(
        (p) => p.stock > 0 || p.availabilityStatus === "In Stock"
      );
    } else if (
      !filters.availability.inStock &&
      filters.availability.outOfStock
    ) {
      filtered = filtered.filter(
        (p) => p.stock === 0 || p.availabilityStatus === "Out of Stock"
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filter by colors (if you have color data in products)
    if (filters.colors.length > 0) {
      // This assumes products have a 'color' or 'colors' field
      filtered = filtered.filter((p) =>
        filters.colors.some((color) => p.tags?.includes(color.toLowerCase()))
      );
    }

    // Filter by product types
    if (filters.productTypes.length > 0) {
      filtered = filtered.filter((p) =>
        filters.productTypes.some(
          (type) =>
            p.category?.toLowerCase() === type.toLowerCase() ||
            p.tags?.some((tag) => tag.toLowerCase() === type.toLowerCase())
        )
      );
    }

    return filtered;
  };

  // Sort Logic
  const getSortedProducts = (products) => {
    let sorted = [...products];

    switch (sortBy) {
      case "priceLowToHigh":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceHighToLow":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Assuming products have a date or id field
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "bestSelling":
        // Assuming products have a sales or rating field
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "mostReviewed":
        sorted.sort(
          (a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)
        );
        break;
      case "featured":
      default:
        // Keep original order
        break;
    }

    return sorted;
  };

  // Get filtered and sorted products
  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);

  // Pagination
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, priceRange, sortBy]);

  // Handle filter changes
  const handleAvailabilityChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [type]: !prev.availability[type],
      },
    }));
  };

  const handleColorChange = (colorName) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }));
  };

  const handleProductTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter((t) => t !== type)
        : [...prev.productTypes, type],
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      availability: {
        inStock: false,
        outOfStock: false,
      },
      colors: [],
      productTypes: [],
    });
    setPriceRange([0, 10000]);
    setSortBy("featured");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10 px-4 sm:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        {query ? (
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              Search Results for{" "}
              <span className="text-pink-600">"{query}"</span>
            </h1>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              ← Back to All Products
            </button>
          </div>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 text-center">
            Best Sellers
          </h1>
        )}
      </div>

      {/* Main Content - Filter + Products */}
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Filter Sidebar - Sticky with Tailwind */}
        <aside className="hidden lg:block w-64 sticky top-4 self-start h-[calc(100vh-2rem)] overflow-y-auto bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Filter by</h2>
            <button
              onClick={clearAllFilters}
              className="text-xs text-pink-600 hover:text-pink-700 font-medium"
            >
              Clear all
            </button>
          </div>

          {/* Availability */}
          <div className="mb-4 border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection("availability")}
              className="w-full flex items-center justify-between font-medium text-gray-800 text-sm mb-3"
            >
              Availability
              <span
                className={`transform transition-transform ${
                  openSections.availability ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openSections.availability && (
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 accent-gray-800"
                    checked={filters.availability.inStock}
                    onChange={() => handleAvailabilityChange("inStock")}
                  />
                  <span className="text-sm text-gray-700">In stock</span>
                  <span className="ml-auto text-xs text-gray-400">
                    (
                    {
                      productsArray.filter(
                        (p) =>
                          p.stock > 0 || p.availabilityStatus === "In Stock"
                      ).length
                    }
                    )
                  </span>
                </label>
                <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 accent-gray-800"
                    checked={filters.availability.outOfStock}
                    onChange={() => handleAvailabilityChange("outOfStock")}
                  />
                  <span className="text-sm text-gray-700">Out of stock</span>
                  <span className="ml-auto text-xs text-gray-400">
                    (
                    {
                      productsArray.filter(
                        (p) =>
                          p.stock === 0 ||
                          p.availabilityStatus === "Out of Stock"
                      ).length
                    }
                    )
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="mb-4 border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between font-medium text-gray-800 text-sm mb-3"
            >
              Price
              <span
                className={`transform transition-transform ${
                  openSections.price ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openSections.price && (
              <div className="space-y-4">
                {/* Slider */}
                <div className="px-1 py-2">
                  <Slider
                    range
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                  />
                </div>

                {/* Price Inputs */}
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 mb-1 block">
                      From
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value) || 0,
                            priceRange[1],
                          ])
                        }
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-gray-800"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="text-xs text-gray-600 mb-1 block">
                      To
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value) || maxPrice,
                          ])
                        }
                        className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color */}
          <div className="mb-4 border-b border-gray-200 pb-4">
            <button
              onClick={() => toggleSection("color")}
              className="w-full flex items-center justify-between font-medium text-gray-800 text-sm mb-3"
            >
              Color
              <span
                className={`transform transition-transform ${
                  openSections.color ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openSections.color && (
              <div className="space-y-2">
                {[
                  { code: "001", color: "#D4B5A0", name: "001" },
                  { code: "002", color: "#F5D7C3", name: "002" },
                  { code: "003", color: "#F8D5BA", name: "003" },
                  { code: "004", color: "#E8C4A6", name: "004" },
                  { code: "005", color: "#F0CDB0", name: "005" },
                  { code: "006", color: "#F5D4B8", name: "006" },
                  { code: "007", color: "#D9A673", name: "007" },
                  { code: "008", color: "#C49A6B", name: "008" },
                  {
                    code: "03 Alaskan Aurora",
                    color:
                      "linear-gradient(135deg, #B8956A 0%, #F5E6D3 50%, #E8D4B8 100%)",
                    name: "03 Alaskan Aurora",
                    isGradient: true,
                  },
                  { code: "02 Beige", color: "#F5D9C0", name: "02 Beige" },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded group"
                  >
                    <div className="relative mr-3">
                      <input
                        type="checkbox"
                        className="peer absolute opacity-0 w-10 h-15 cursor-pointer z-10"
                        checked={filters.colors.includes(item.name)}
                        onChange={() => handleColorChange(item.name)}
                      />
                      <div
                        className="w-6 h-6 rounded-md border-2 border-gray-300 peer-checked:border-gray-800 peer-checked:border-[3px] transition-all"
                        style={
                          item.isGradient
                            ? { background: item.color }
                            : { backgroundColor: item.color }
                        }
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 flex-1">
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400">1</span>
                  </label>
                ))}
                <button className="text-sm text-gray-600 hover:text-gray-800 mt-2 flex items-center">
                  + Show more
                </button>
              </div>
            )}
          </div>

          {/* Product Type */}
          <div className="mb-4">
            <button
              onClick={() => toggleSection("productType")}
              className="w-full flex items-center justify-between font-medium text-gray-800 text-sm mb-3"
            >
              Product type
              <span
                className={`transform transition-transform ${
                  openSections.productType ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>
            {openSections.productType && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {[
                  "beauty",
                  "fragrances",
                  "furniture",
                  "groceries",
                  "home-decoration",
                  "kitchen-accessories",
                  "laptops",
                  "mens-shirts",
                  "mens-shoes",
                  "mens-watches",
                  "mobile-accessories",
                  "motorcycle",
                  "skin-care",
                  "smartphones",
                  "sports-accessories",
                  "sunglasses",
                  "tablets",
                  "tops",
                  "vehicle",
                  "womens-bags",
                  "womens-dresses",
                  "womens-jewellery",
                  "womens-shoes",
                  "womens-watches",
                ].map((type, idx) => (
                  <label
                    key={idx}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 accent-gray-800"
                      checked={filters.productTypes.includes(type)}
                      onChange={() => handleProductTypeChange(type)}
                    />
                    <span className="text-sm text-gray-700 flex-1 capitalize">
                      {type.replace(/-/g, " ")}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({productsArray.filter((p) => p.category === type).length}
                      )
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          {/* Sort By */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <p className="text-gray-600 text-sm">
              {sortedProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white cursor-pointer hover:border-gray-400"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="bestSelling">Best Selling</option>
                <option value="mostReviewed">Most Reviewed</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.availability.inStock ||
            filters.availability.outOfStock ||
            filters.colors.length > 0 ||
            filters.productTypes.length > 0 ||
            priceRange[0] !== 0 ||
            priceRange[1] !== 10000) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.availability.inStock && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  In Stock
                  <button
                    onClick={() => handleAvailabilityChange("inStock")}
                    className="hover:text-gray-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.availability.outOfStock && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Out of Stock
                  <button
                    onClick={() => handleAvailabilityChange("outOfStock")}
                    className="hover:text-gray-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filters.colors.map((color) => (
                <span
                  key={color}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {color}
                  <button
                    onClick={() => handleColorChange(color)}
                    className="hover:text-gray-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {filters.productTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize"
                >
                  {type.replace(/-/g, " ")}
                  <button
                    onClick={() => handleProductTypeChange(type)}
                    className="hover:text-gray-900"
                  >
                    ✕
                  </button>
                </span>
              ))}
              {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <button
                    onClick={() => setPriceRange([0, 10000])}
                    className="hover:text-gray-900"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col relative group"
                >
                  {/* Bestseller Tag */}
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    BESTSELLER
                  </span>

                  {/* Stock Badge */}
                  {(product.stock === 0 ||
                    product.availabilityStatus === "Out of Stock") && (
                    <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      OUT OF STOCK
                    </span>
                  )}

                  <div className="flex justify-center">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-56 object-contain"
                    />
                  </div>
                  <div className="mt-4 flex flex-col flex-grow">
                    <h1 className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {product.title}
                    </h1>
                    <div className="flex items-center text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={12}
                          color={
                            i < Math.floor(product.rating)
                              ? "#facc15"
                              : "#d1d5db"
                          }
                        />
                      ))}
                      <span className="text-gray-500 text-xs ml-1">
                        {product.rating || 0} ({product.reviews?.length || 0}{" "}
                        reviews)
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm mt-2">
                      Rs. {product.price}
                    </p>
                    <div className="flex gap-2 mt-3 mb-4">
                      {["#b84b62", "#6b1a3a", "#d57e89"].map((shade, index) => (
                        <div
                          key={index}
                          className="w-5 h-5 rounded-md border border-gray-300"
                          style={{ backgroundColor: shade }}
                        ></div>
                      ))}
                    </div>
                    <Link
                      to={`/productDetails/${product.id}`}
                      className="mt-auto bg-black text-white py-2 rounded-lg hover:bg-gray-800 text-sm transition text-center"
                    >
                      Select Shades
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-20">
                <p className="text-gray-500 text-lg mb-4">No Products Found</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {sortedProducts.length > productsPerPage && (
            <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
