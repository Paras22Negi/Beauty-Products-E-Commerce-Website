import * as ratingServices from "../services/Raiting.Services.js";

const createRating = async (req, res) => {
  try {
    const user = req.user;
    const reqBody = req.body;
    const rating = await ratingServices.createRating(user, reqBody);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getProductsRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    const ratings = await ratingServices.getProductsRating(productId);
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export { createRating, getProductsRating };
