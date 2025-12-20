import * as reviewServices from "../services/Review.Service.js";

const createReview = async (req, res) => {
  const user = req.user;
  const reqBody = req.body;
  console.log(`product id ${reqBody.productId} - ${reqBody.review}`);
  try {
    const review = await reviewServices.createReview(reqBody, user);
    return res.status(201).send(review);
  } catch (error) {
    console.log("error --- ", error.message);
    return res.status(403).json({ error: error.message });
  }
};

const getAllReview = async (req, res) => {
  const productId = req.params.productId;
  console.log("product id ", productId);
  try {
    const reviews = await reviewServices.getAllReviews(productId);
    return res.status(200).send(reviews);
  } catch (error) {
    console.log("error --- ", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const checkReviewEligibility = async (req, res) => {
  const user = req.user;
  const productId = req.params.productId;
  try {
    const isEligible = await reviewServices.checkReviewEligibility(
      user._id,
      productId
    );
    return res.status(200).send({ isEligible });
  } catch (error) {
    console.log("error --- ", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { createReview, getAllReview, checkReviewEligibility };
