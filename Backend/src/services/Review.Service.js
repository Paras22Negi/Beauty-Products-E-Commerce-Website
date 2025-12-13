import Review from "../Models/reviews.Model.js";
import * as productService from "./Product.Services.js";

const createReview = async (reqData, user) => {
  const product = await productService.findProductById(reqData.productId);
  if (!product) {
    throw new Error("Product not found with Id:");
  }
  const review = new Review({
    user: user._id,
    product: product._id,
    review: reqData.review,
    description: reqData.description,
    rating: reqData.rating,
    createdAt: new Date(),
  });
  return await review.save();
};

const getAllReviews = async (productId) => {
  const product = await productService.findProductById(productId);
  if (!product) {
    throw new Error("Product not found with id:", productId);
  }
  const reviews = await Review.find({ product: product._id })
    .populate("user")
    .exec();
  const ratingCounts = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  let totalRating = 0;
  for (const review of reviews) {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating]++;
      totalRating += review.rating;
    }
  }

  const totalRatings = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
  const averageRating =
    totalRatings > 0 ? (totalRating / totalRatings).toFixed(1) : 0;

  return {
    reviews,
    ratingSummary: {
      counts: ratingCounts,
      totalRatings,
      averageRating: Number(averageRating),
    },
  };
};

export { createReview, getAllReviews };
