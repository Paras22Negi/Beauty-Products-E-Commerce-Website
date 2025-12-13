import Rating from "../Models/rating.Model.js";
import * as productService from "./Product.Services.js";

const createRaiting = async (req, user) => {
  const product = await productService.findProductById(req.body.productId);
  const raiting = new Rating({
    product: product._id,
    user: user._id,
    rating: req.raiting,
    createdAt: new Date(),
  });
  return await raiting.save();
};

const getProductRaitings = async (productId) => {
  return await Rating.find({ product: productId });
};

const getProductRaitingSummary = async (productId) => {
  const ratings = await Rating.find({ product: productId });
  if (!ratings.length) return null;
  const summary = {
    total: ratings.length,
    average: 0,
    breakdown: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  };
  let sum = 0;
  for (const r of ratings) {
    summary.breakdown[r.rating]++;
    sum += r.rating;
  }
  summary.average = (sum / ratings.length).toFixed(1);
  return summary;
};

export { createRaiting, getProductRaitings, getProductRaitingSummary };
