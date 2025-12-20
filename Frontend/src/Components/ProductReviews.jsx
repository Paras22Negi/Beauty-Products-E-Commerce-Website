import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  checkReviewEligibility,
  submitReviewWithRating,
  getProductReviews,
} from "../redux/review/action";

const ProductReviews = ({
  productId,
  reviews: initialReviews = [],
  rating = 0,
}) => {
  const dispatch = useDispatch();
  const {
    isEligible,
    loading,
    submitting,
    reviews: fetchedReviews,
  } = useSelector((state) => state.review);
  const { user } = useSelector((state) => state.account);

  const [sortBy, setSortBy] = useState("newest");
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formRating, setFormRating] = useState(5);
  const [formReview, setFormReview] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const reviews = fetchedReviews?.length > 0 ? fetchedReviews : initialReviews;

  useEffect(() => {
    if (productId) {
      dispatch(getProductReviews(productId));
      if (user) {
        dispatch(checkReviewEligibility(productId));
      }
    }
  }, [dispatch, productId, user]);

  // Calculate rating breakdown
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    if (sortBy === "newest") return dateB - dateA;
    return dateA - dateB;
  });

  const displayedReviews = sortedReviews.slice(0, visibleReviews);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : rating.toFixed(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formReview.trim()) return;

    const reviewData = {
      productId,
      rating: formRating,
      review: formReview,
      description: formDescription,
    };

    const result = await dispatch(submitReviewWithRating(reviewData));
    if (result.success) {
      setIsModalOpen(false);
      setFormReview("");
      setFormDescription("");
      setFormRating(5);
      alert("Review submitted successfully!");
    } else {
      alert(result.error || "Failed to submit review");
    }
  };

  return (
    <div className="w-full bg-white py-10 px-4 sm:px-8 border-t">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-10 text-gray-800">
          Customer Reviews
        </h2>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left - Overall Rating */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="bg-gray-800 text-white px-8 py-5 rounded-2xl text-center shadow-lg">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div className="text-xs mt-1 opacity-80 uppercase tracking-widest">
                out of 5
              </div>
            </div>
            <div className="flex text-yellow-500 mt-4 text-sm gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(averageRating) ? "" : "text-gray-200"
                  }
                />
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-3 font-medium">
              Verified by {totalReviews} customers
            </p>
          </div>

          {/* Middle - Rating Bars */}
          <div className="flex-1 max-w-md">
            {[5, 4, 3, 2, 1].map((star, index) => {
              const count = ratingCounts[index];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-semibold text-gray-600 w-3">
                    {star}
                  </span>
                  <div className="flex text-yellow-400 text-[10px]">
                    <FaStar />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gray-800 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-[11px] w-6">
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right - Write Review Button */}
          <div className="flex items-start">
            {isEligible ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-all font-semibold text-sm shadow-md hover:shadow-lg active:scale-95"
              >
                Write a review
              </button>
            ) : user ? (
              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl max-w-xs">
                <p className="text-amber-800 text-xs leading-relaxed italic">
                  Only customers who have purchased this product can leave a
                  review.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Sort and Filters */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">Reviews List</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-none bg-gray-50 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-6">
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review, index) => {
              const reviewerName =
                review.user?.name || review.reviewerName || "Verified Customer";
              const initials = reviewerName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              const reviewDate = new Date(
                review.createdAt || review.date
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-rose-50/50">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">
                          {reviewerName}
                        </p>
                        <span className="text-gray-400 text-[11px] font-medium tracking-wide uppercase">
                          {reviewDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex text-yellow-400 text-xs gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < (review.rating || 5) ? "" : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-800 mb-2 text-base">
                    {review.review || "Excellent Product!"}
                  </h4>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {review.description || review.comment}
                  </p>

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 transition-colors text-xs font-medium uppercase tracking-wider">
                      <FaThumbsUp className="text-sm" />
                      Helpful (0)
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors text-xs font-medium uppercase tracking-wider">
                      <FaThumbsDown className="text-sm" />
                      Report
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
              <div className="text-4xl mb-4 opacity-20 italic font-serif">
                "
              </div>
              <p className="text-gray-400 font-medium">
                Be the first to share your experience with this product!
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleReviews < reviews.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleReviews((prev) => prev + 3)}
              className="border-2 border-gray-800 text-gray-800 px-10 py-3 rounded-xl hover:bg-gray-800 hover:text-white transition-all font-bold text-sm"
            >
              Load more reviews
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white rounded-3xl w-full max-w-xl relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
              <h3 className="text-xl font-bold text-gray-800">
                Write a Review
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-widest">
                  Rate your experience
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 active:scale-95 ${
                        star <= formRating ? "text-yellow-400" : "text-gray-200"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={formReview}
                    onChange={(e) => setFormReview(e.target.value)}
                    placeholder="Summarize your experience (e.g., Amazing shade, lasts long!)"
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Detailed Review
                  </label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Tell us more about the texture, color, and wear time..."
                    className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-black transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
