import React, { useState } from "react";
import { FaStar, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const ProductReviews = ({ reviews = [], rating = 0 }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [visibleReviews, setVisibleReviews] = useState(3);

  // Calculate rating breakdown
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date) - new Date(a.date);
    }
    return new Date(a.date) - new Date(b.date);
  });

  const displayedReviews = sortedReviews.slice(0, visibleReviews);

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : rating.toFixed(1);

  return (
    <div className="w-full bg-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left - Overall Rating */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="bg-gray-800 text-white px-6 py-4 rounded-lg text-center">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div className="text-sm mt-1">out of 5</div>
            </div>
            <p className="text-gray-600 text-sm mt-3">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Middle - Rating Bars */}
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((star, index) => {
              const count = ratingCounts[index];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <div className="flex text-yellow-400 text-sm">
                    {[...Array(star)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gray-800 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-gray-600 text-sm w-8">({count})</span>
                </div>
              );
            })}
          </div>

          {/* Right - Write Review Button */}
          <div className="flex items-start">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition">
              Write a review
            </button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-end mb-6">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            <option value="newest">Sort reviews - Newest</option>
            <option value="oldest">Sort reviews - Oldest</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map((review, index) => {
            const initials = review.reviewerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            const reviewDate = new Date(review.date).toLocaleDateString(
              "en-US",
              {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              }
            );

            return (
              <div key={index} className="border-b border-gray-200 pb-6">
                {/* Stars */}
                <div className="flex text-yellow-400 text-sm mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "" : "text-gray-300"}
                    />
                  ))}
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.reviewerName}
                    </p>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mb-3 leading-relaxed">
                  {review.comment}
                </p>

                {/* Date and Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{reviewDate}</span>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition">
                      <FaThumbsUp className="text-sm" />
                      <span className="text-sm">(0)</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition">
                      <FaThumbsDown className="text-sm" />
                      <span className="text-sm">(0)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleReviews < reviews.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleReviews((prev) => prev + 3)}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
