import Product from "../Models/Product.Model.js";
import Category from "../Models/category.Model.js";
import cloudinary from "cloudinary";

const createProduct = async (req) => {
    try {
      const reqData = req.body;
      const sizes = reqData.sizes;
      if (typeof sizes === "string") {
        reqData.sizes = JSON.parse(sizes);
      }
      if (!req.files || req.files.length === 0) {
        throw new Error("No images uploaded");
      }
      const uploadResult = await Promise.all(
        req.files.map((file) => {
          const base64Image = `data:${
            file.mimetype
          };base64,${file.data.toString("base64")}`;
          return cloudinary.uploader.upload(base64Image);
        })
      );
      const imageUrls = uploadResult.map((result) => result.secure_url);
      console.log("imageUrls:", imageUrls);

      // Handle category creation
      const topLevel =
        (await Category.findOne({ name: reqData.topLevelCategory })) ||
        (await new Category({
          name: reqData.topLevelCategory,
          level: 1,
        }).save());

      const secondLevel =
        (await Category.findOne({
          name: reqData.secondLevelCategory,
          parentCategory: topLevel._id,
        })) ||
        (await new Category({
          name: reqData.secondLevelCategory,
          parentCategory: topLevel._id,
          level: 2,
        }).save());

      const thirdLevel =
        (await Category.findOne({
          name: reqData.thirdLevelCategory,
          parentCategory: secondLevel._id,
        })) ||
        (await new Category({
          name: reqData.thirdLevelCategory,
          parentCategory: secondLevel._id,
          level: 3,
        }).save());

      // Create and save product
      const product = new Product({
        title: reqData.title,
        description: reqData.description,
        discountedPrice: reqData.discountedPrice,
        discountPersent: reqData.discountPersent,
        imageUrl: imageUrls,
        brand: reqData.brand,
        price: reqData.price,
        sizes: sizes,
        quantity: reqData.quantity,
        color: reqData.color,
        category: thirdLevel._id,
      });

      return await product.save();
    } catch (error) {
      console.error("Create Product Error:", error);
      throw new Error(error.message || "Something went wrong");
    }
}

// Delete product by id 
const deleteProduct = async (productId) => {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
}

// Update product by id 
const updateProduct = async (productId, reqData) => {
  const updatedProduct = await Product.findByIdAndUpdate(productId, reqData);
  return updatedProduct;
}

// Find product by id 
const findProductById = async (productId) => {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products 
const getAllProducts = async (reqQuery) => {
  const {
    category,
    color,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  (pageSize = pageSize || 10), (pageNumber = pageNumber || 1);
  const query = Product.find().populate("category");

  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory)
      query = query.where("category").equals(existCategory._id);
    else return { content: [], currentPage: 1, totalPages: 1 };
  }

  if (color) {
    const colorSet = new Set(
      color.split(",").map((color) => color.trim().toLowerCase())
    );
    const colorRegex =
      colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    query = query.where("color").regex(colorRegex);
    // query = query.where("color").in([...colorSet]);
  }

  if (sizes) {
    const sizesSet = new Set(sizes);

    query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
    query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
    query = query.where("discountPersent").gt(minDiscount);
  }

  if (stock) {
    if (stock === "in_stock") {
      query = query.where("quantity").gt(0);
    } else if (stock === "out_of_stock") {
      query = query.where("quantity").lte(0);
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const totalProducts = await Product.countDocuments(query);

  const skip = (pageNumber - 1) * pageSize;

  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);

  return { content: products, currentPage: pageNumber, totalPages: totalPages };
}

const createMultipleProduct = async (products) => {
  for (let product of products) {
    await createProduct(product);
  }
}

const normalizeText = (text) => {
  return text.trim().toLowerCase().replace(/s$/, ""); // removes plural 's' (basic plural support)
}

const searchProducts = async (reqQuery) => {
  const normalizedQuery = query.trim().toLowerCase();

  // Find matching categories (case-insensitive)
  const matchingCategories = await Category.find({
    name: { $regex: new RegExp(normalizedQuery, "i") },
  });

  const matchingCategoryIds = matchingCategories.map((cat) => cat._id);

  // Collect all child categories recursively
  const allCategoryIds = new Set(
    matchingCategoryIds.map((id) => id.toString())
  );

  async function fetchChildCategories(parentIds) {
    const children = await Category.find({
      parentCategory: { $in: parentIds },
    });
    for (const child of children) {
      allCategoryIds.add(child._id.toString());
    }
    if (children.length > 0) {
      await fetchChildCategories(children.map((c) => c._id));
    }
  }

  await fetchChildCategories(matchingCategoryIds);

  // Now find products in those categories
  const products = await Product.find({
    category: { $in: [...allCategoryIds] },
  }).populate({
    path: "category",
    populate: {
      path: "parentCategory",
      populate: {
        path: "parentCategory",
      },
    },
  });

  return products;
}

export { createProduct, getAllProducts, findProductById, deleteProduct, updateProduct, createMultipleProduct, searchProducts };