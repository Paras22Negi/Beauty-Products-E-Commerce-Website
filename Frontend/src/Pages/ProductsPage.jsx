import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { fetchProduct, searchProduct } from "../redux/Product/action";
import { ClipLoader } from "react-spinners";
import { FaStar } from "react-icons/fa";

function ProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, product } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

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

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = productsArray.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productsArray.length / productsPerPage);

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
      <div className="max-w-6xl mx-auto mb-10 text-center">
        {query ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              Search Results for{" "}
              <span className="text-pink-600">“{query}”</span>
            </h1>
            <button
              onClick={() => navigate("/products")}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              ← Back to All Products
            </button>
          </>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
            Best Sellers
          </h1>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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

              {/* Product Image */}
              <div className="flex justify-center">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-56 object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="mt-4 flex flex-col flex-grow">
                <h1 className="text-sm font-semibold text-gray-800 line-clamp-1">
                  {product.title}
                </h1>

                {/* Rating (placeholder stars for now) */}
                <div className="flex items-center text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} color="#facc15" />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">
                    {Math.floor(Math.random() * 200)} reviews
                  </span>
                </div>

                {/* Price */}
                <p className="font-semibold text-gray-800 text-sm mt-2">
                  Rs. {product.price}
                </p>

                {/* Shades (fake color swatches) */}
                <div className="flex gap-2 mt-3 mb-4">
                  {["#b84b62", "#6b1a3a", "#d57e89"].map((shade, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-md border border-gray-300"
                      style={{ backgroundColor: shade }}
                    ></div>
                  ))}
                </div>

                {/* Button */}
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
          <p className="col-span-4 text-center text-gray-500 text-lg">
            No Products Found
          </p>
        )}
      </div>

      {/* Pagination */}
      {productsArray.length > productsPerPage && (
        <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
