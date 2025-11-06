import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { fetchProduct, searchProduct } from "../Redux/Product/action";
import { ClipLoader } from "react-spinners";

function ProductsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, product } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // 🧠 extract ?search=query
  const query = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    if (query) {
      dispatch(searchProduct(query)); // perform search
    } else {
      dispatch(fetchProduct()); // fetch all
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
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* 🔙 Back button & heading */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col items-center text-center">
        {query ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
              Search Results for{" "}
              <span className="text-blue-600">“{query}”</span>
            </h1>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ← Back to All Products
            </button>
          </>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
            All Products
          </h1>
        )}
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all p-5 flex flex-col"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-52 object-cover rounded-xl"
              />
              <div className="mt-4 flex flex-col flex-grow">
                <h1 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {product.title}
                </h1>
                <p className="text-blue-600 font-bold text-md mt-1">
                  ₹{product.price}
                </p>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {product.description}
                </p>
                <Link
                  to={`/productDetails/${product.id}`}
                  className="mt-auto w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Detail
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500 text-lg">
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
                  ? "bg-blue-600 text-white"
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
