import * as productServices from "../services/Product.Services.js";

const createProduct = async (req, res) => {
  try {
    const product = await productServices.createProduct(req);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const message = await productServices.deleteProduct(productId);
    return res.json({ message });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productServices.updateProduct(productId, req);
    return res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const findProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productServices.findProductById(productId);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

const findProductByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productServices.findProductByCategory(category);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productServices.getAllProducts(req.query);
    res.status(200).json(products);
  } catch (error) {
    console.log("getAllProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createMultipleProduct = async (req, res) => {
  try {
    await productServices.createMultipleProduct(req.body);
    res
      .status(202)
      .json({ message: "Products Created Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const products = await productServices.searchProducts(searchQuery);
    res.status(200).json({ content: products, products });
  } catch (error) {
    console.log("searchProducts error:", error);
    res.status(500).json({ error: error.message });
  }
};

export {
  createProduct,
  getAllProducts,
  findProductById,
  searchProducts,
  createMultipleProduct,
  deleteProduct,
  updateProduct,
  findProductByCategory,
};
