import Category from "../Models/category.Model.js";
import Product from "../Models/product.Model.js";
import streamifier from "streamifier";
import cloudinaryLib from "../config/cloudinary.js";
import stringSimilarity from "string-similarity";

// ---------- Helper: resolve product from query or session ----------
const resolveProductFromQuery = async (session, rawQuery) => {
  // Try to use existing session-known products first (improves follow-ups)
  const q = (rawQuery || "").trim();
  // 1) If user provided a non-empty query, try DB first
  if (q) {
    // try DB best product
    const dbMatch = await findBestProduct(q);
    if (dbMatch) return dbMatch;
  }

  // 2) If session has lastProducts, try fuzzy match against their titles
  try {
    const lastProducts = (session && session.lastProducts) || [];
    if (lastProducts && lastProducts.length) {
      // create arrays of titles and map index->product
      const titles = lastProducts.map((p) => (p.title || "").toLowerCase());
      const qLower = (q || "").toLowerCase();
      // try exact title match first
      const exactIndex = titles.findIndex((t) => t === qLower);
      if (exactIndex !== -1) {
        return await findProductById(lastProducts[exactIndex]._id);
      }
      // fuzzy match using stringSimilarity
      const match = stringSimilarity.findBestMatch(qLower, titles);
      if (match && match.bestMatch && match.bestMatch.rating > 0.5) {
        const idx = match.bestMatchIndex;
        return await findProductById(lastProducts[idx]._id);
      }
      // if no query provided (user just said "describe" after category), pick first
      if (!q && lastProducts.length) {
        return await findProductById(lastProducts[0]._id);
      }
    }
  } catch (e) {
    console.warn(
      "resolveProductFromQuery session fuzzy failed",
      e?.message || e
    );
  }

  // 3) fallback: lastProductId in session
  try {
    if (session && session.lastProductId) {
      return await findProductById(session.lastProductId);
    }
  } catch (e) {
    /* ignore */
  }

  // 4) final fallback: try findBestProduct again (with query)
  if (q) {
    return await findBestProduct(q);
  }
  return null;
};

// helpers at top of file
const escapeRegex = (str = "") => {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex chars
};
const normalizeForCompare = (s = "") => {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
};

const findBestProduct = async (query) => {
  if (!query || !String(query).trim()) return null;
  const raw = String(query).trim();

  // 0) if query looks like a Mongo ObjectId, try findById
  if (/^[0-9a-fA-F]{24}$/.test(raw)) {
    const byId = await Product.findById(raw)
      .populate({
        path: "category",
        populate: {
          path: "parentCategory",
          populate: { path: "parentCategory" },
        },
      })
      .exec();
    if (byId) return byId;
  }

  // normalized forms to compare
  const normQuery = normalizeForCompare(raw);

  // 1) try normalized exact title match using JS compare (faster & robust)
  const exactCandidates = await Product.find({ title: { $exists: true } })
    .select("title")
    .limit(200)
    .exec();

  for (const cand of exactCandidates) {
    if (normalizeForCompare(cand.title || "") === normQuery) {
      const full = await Product.findById(cand._id)
        .populate({
          path: "category",
          populate: {
            path: "parentCategory",
            populate: { path: "parentCategory" },
          },
        })
        .exec();
      if (full) return full;
    }
  }

  // 2) case-insensitive exact match via regex (anchors)
  try {
    const re = new RegExp("^\\s*" + escapeRegex(raw) + "\\s*$", "i");
    let product = await Product.findOne({ title: { $regex: re } })
      .populate({
        path: "category",
        populate: {
          path: "parentCategory",
          populate: { path: "parentCategory" },
        },
      })
      .exec();
    if (product) return product;
  } catch (e) {
    // ignore regex errors
  }

  // 3) title contains all tokens (existing approach)
  const tokens = normQuery.split(/\s+/).filter(Boolean);
  if (tokens.length) {
    const tokenRegex = tokens.map((t) => `(?=.*${escapeRegex(t)})`).join("");
    const reAll = new RegExp(tokenRegex + ".*", "i");
    let product = await Product.findOne({ title: { $regex: reAll } })
      .populate({
        path: "category",
        populate: {
          path: "parentCategory",
          populate: { path: "parentCategory" },
        },
      })
      .exec();
    if (product) return product;
  }

  // 4) brand, color, category, or description fallback (as before)
  let product = await Product.findOne({
    brand: { $regex: new RegExp(escapeRegex(raw), "i") },
  })
    .populate({
      path: "category",
      populate: {
        path: "parentCategory",
        populate: { path: "parentCategory" },
      },
    })
    .exec();
  if (product) return product;

  const matchingCategory = await Category.findOne({
    name: { $regex: new RegExp(escapeRegex(raw), "i") },
  });
  if (matchingCategory) {
    product = await Product.findOne({ category: matchingCategory._id })
      .populate({
        path: "category",
        populate: {
          path: "parentCategory",
          populate: { path: "parentCategory" },
        },
      })
      .exec();
    if (product) return product;
  }

  // 5) final fallback: title/description search
  const regex = new RegExp(raw.split(/\s+/).map(escapeRegex).join("|"), "i");
  const list = await Product.find({
    $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
  })
    .limit(1)
    .populate({
      path: "category",
      populate: {
        path: "parentCategory",
        populate: { path: "parentCategory" },
      },
    })
    .exec();

  return list.length ? list[0] : null;
};

const formatCurrencyINR = (n) => {
  if (n === undefined || n === null) return "N/A";
  return `₹${Number(n).toLocaleString("en-IN")}`;
};

const getProductInfo = async (queryOrProduct) => {
  let product = null;
  if (!queryOrProduct) return null;

  if (typeof queryOrProduct === "string") {
    product = await findBestProduct(queryOrProduct);
    if (!product) return null;
  } else {
    product = queryOrProduct;
  }

  // prepare fields from your existing schema
  const title = product.title || "Product";
  const brand = product.brand || "";
  const price = product.discountedPrice ?? product.price ?? null;
  const discount = product.discountPersent || 0;
  const sizes = Array.isArray(product.sizes)
    ? product.sizes.map((s) => s.name || s).join(", ")
    : "One size";
  const colors = Array.isArray(product.color)
    ? product.color.join(", ")
    : product.color || "Various";
  const qty = product.quantity ?? 0;
  const availability = qty > 0 ? `In stock (${qty} available)` : "Out of stock";
  const rating = product.numRatings
    ? `${product.numRatings} ratings`
    : "No ratings yet";
  const care =
    product.care ||
    (product.attributes &&
      product.attributes.get &&
      product.attributes.get("care")) ||
    "Care info not specified";
  const material =
    product.material ||
    (product.attributes &&
      product.attributes.get &&
      product.attributes.get("material")) ||
    "Material not specified";

  const lines = [];
  lines.push(`${title}${brand ? " by " + brand : ""}`);
  if (price)
    lines.push(
      `Price: ${formatCurrencyINR(price)}${
        discount ? ` (Discount ${discount}%)` : ""
      }`
    );
  lines.push(`Material: ${material}`);
  lines.push(`Sizes: ${sizes}`);
  lines.push(`Colors: ${colors}`);
  lines.push(`Availability: ${availability}`);
  lines.push(`Care: ${care}`);
  lines.push(`Ratings: ${rating}`);

  if (product.description) {
    const desc = String(product.description).trim();
    const snippet = desc.length > 200 ? desc.slice(0, 197) + "..." : desc;
    lines.push(`About: ${snippet}`);
  }

  // return structured result with id too (so assistant can save for follow-ups)
  return { text: lines.join("\n"), productId: String(product._id) };
};
const getProductsByCategoryName = async (name, limit = 10) => {
  if (!name) return [];

  const regex = new RegExp(name.trim(), "i");

  const categories = await Category.find({ name: { $regex: regex } });

  if (!categories.length) return [];

  const catIds = categories.map((c) => c._id);

  // Find products directly under these categories
  const products = await Product.find({ category: { $in: catIds } })
    .limit(limit)
    .populate({
      path: "category",
      populate: {
        path: "parentCategory",
        populate: { path: "parentCategory" },
      },
    });

  return products;
};

// async function createProduct(req) {
//   try {
//     const reqData = req.body;

//     // Parse size string to JSON array
//     let sizes = reqData.size;
//     if (typeof sizes === "string") sizes = JSON.parse(sizes);

//     // Upload images to Cloudinary
//     if (!req.files || req.files.length === 0) throw new Error("No images uploaded");

//     const uploadResults = await Promise.all(
//       req.files.map(file => {
//         const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
//         return cloudinary.uploader.upload(base64Image, {
//           folder: "ecommerce/products",
//         });
//       })
//     );

//     const imageUrls = uploadResults.map(result => result.secure_url);
//     console.log("Uploaded image URLs:", imageUrls);

//     // Handle category creation
//     const topLevel = await Category.findOne({ name: reqData.topLevelCategory }) ||
//       await new Category({ name: reqData.topLevelCategory, level: 1 }).save();

//     const secondLevel = await Category.findOne({
//       name: reqData.secondLevelCategory,
//       parentCategory: topLevel._id,
//     }) || await new Category({
//       name: reqData.secondLevelCategory,
//       parentCategory: topLevel._id,
//       level: 2,
//     }).save();

//     const thirdLevel = await Category.findOne({
//       name: reqData.thirdLevelCategory,
//       parentCategory: secondLevel._id,
//     }) || await new Category({
//       name: reqData.thirdLevelCategory,
//       parentCategory: secondLevel._id,
//       level: 3,
//     }).save();

//     // Create and save product
//     const product = new Product({
//       title: reqData.title,
//       description: reqData.description,
//       discountedPrice: reqData.discountedPrice,
//       discountPersent: reqData.discountPersent,
//       imageUrl: imageUrls,
//       brand: reqData.brand,
//       price: reqData.price,
//       sizes: sizes,
//       quantity: reqData.quantity,
//       color: reqData.color,
//       category: thirdLevel._id,
//     });

//     return await product.save();

//   } catch (error) {
//     console.error("Create Product Error:", error);
//     throw new Error(error.message || "Something went wrong");
//   }
// }

// Delete a product by ID

const createProduct = async (req) => {
  try {
    console.log("== createProduct called ==");
    // Log headers briefly (don't log Authorization or cookies in production)
    console.log("Headers:", {
      "content-type": req.headers["content-type"],
      length: req.headers["content-length"],
    });

    // Log body and files so you can see what arrived
    console.log("Request body keys:", Object.keys(req.body || {}));
    // For sensitive values, avoid printing raw values in production - here it's for dev debugging
    console.log(
      "Request body (preview):",
      Object.entries(req.body || {}).slice(0, 20)
    );
    if (req.files) {
      if (Array.isArray(req.files)) {
        console.log("Files received as array (count):", req.files.length);
        req.files.forEach((f, idx) => {
          console.log(
            `file[${idx}]: fieldname=${f.fieldname} originalname=${f.originalname} mimetype=${f.mimetype} size=${f.size}`
          );
        });
      } else {
        console.log("Files received as object (keys):", Object.keys(req.files));
        Object.keys(req.files).forEach((key) => {
          req.files[key].forEach((f, idx) => {
            console.log(
              `file[${key}][${idx}]: originalname=${f.originalname} mimetype=${f.mimetype} size=${f.size}`
            );
          });
        });
      }
    } else {
      console.warn("No req.files provided.");
    }

    const reqData = req.body || {};

    // Parse sizes safely
    let sizes = reqData.size;
    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch (e) {
        /* keep string if parse fails */
      }
    }

    // Separate images and thumbnail
    const imageFiles =
      (req.files &&
        (req.files.images ||
          (Array.isArray(req.files)
            ? req.files.filter((f) => f.fieldname === "images")
            : []))) ||
      [];
    const thumbnailFiles =
      (req.files &&
        (req.files.thumbnail ||
          (Array.isArray(req.files)
            ? req.files.filter((f) => f.fieldname === "thumbnail")
            : []))) ||
      [];

    // Validate presence
    if (imageFiles.length === 0 && thumbnailFiles.length === 0) {
      console.error("Create Product Error: No images or thumbnail uploaded");
      throw new Error("No images uploaded");
    }

    // Log Cloudinary config (non-sensitive parts). Avoid logging API key/secret.
    try {
      // If your config exported cloudinary.v2 instance:
      const cfg = cloudinaryLib.config
        ? cloudinaryLib.config()
        : (cloudinaryLib && cloudinaryLib.config && cloudinaryLib.config()) ||
          {};
      console.log(
        "Cloudinary config (cloud_name):",
        cfg.cloud_name ||
          cfg.cloud ||
          process.env.CLOUDINARY_CLOUD_NAME ||
          "<not-set>"
      );
    } catch (e) {
      console.warn(
        "Could not read Cloudinary config for logging:",
        e?.message || e
      );
    }

    // Upload each file using upload_stream (safe for buffer-based multer)
    const uploadToCloudinary = (file, options = {}) => {
      return new Promise((resolve, reject) => {
        // support both buffer (multer memoryStorage) and filesystem path
        if (file.buffer && file.buffer.length) {
          const uploadStream = (
            cloudinaryLib.uploader || cloudinaryLib
          ).upload_stream(options, (err, result) => {
            if (err) {
              console.error(
                "Cloudinary upload_stream error:",
                err?.message || err
              );
              return reject(err);
            }
            resolve(result);
          });
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        } else if (file.path) {
          // multer disk storage: upload by path
          (cloudinaryLib.uploader || cloudinaryLib)
            .upload(file.path, options)
            .then(resolve)
            .catch((err) => {
              console.error(
                "Cloudinary upload (path) error:",
                err?.message || err
              );
              reject(err);
            });
        } else {
          return reject(new Error("File has neither buffer nor path"));
        }
      });
    };

    // Do uploads in parallel
    const uploadToCloudinaryWithStatus = (file, options = {}) =>
      uploadToCloudinary(file, options)
        .then((r) => ({ ok: true, r, field: file.fieldname }))
        .catch((err) => ({ ok: false, err, field: file.fieldname }));

    let uploadResults;
    try {
      const allFiles = [...imageFiles, ...thumbnailFiles];
      const uploads = allFiles.map((file) =>
        uploadToCloudinaryWithStatus(file, { folder: "ecommerce/products" })
      );
      uploadResults = await Promise.all(uploads);
    } catch (e) {
      console.error("Unexpected error during upload Promise.all:", e);
      throw new Error("Image upload failed");
    }

    // Inspect results
    const failed = uploadResults.filter((u) => !u.ok);
    if (failed.length) {
      console.error(`Cloudinary: ${failed.length} uploads failed`);
      throw new Error("One or more image uploads failed.");
    }

    const imageUrls = uploadResults
      .filter((u) => u.field === "images")
      .map((u) => u.r.secure_url || u.r.url);

    const thumbnailUrl = uploadResults.find((u) => u.field === "thumbnail")?.r
      .secure_url;

    console.log("Uploaded image URLs:", imageUrls);
    console.log("Uploaded thumbnail URL:", thumbnailUrl);

    // Continue existing category logic (keep as-is)
    const topLevel =
      (await Category.findOne({ name: reqData.topLevelCategory })) ||
      (await new Category({ name: reqData.topLevelCategory, level: 1 }).save());

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
      thumbnail: thumbnailUrl,
    });

    const saved = await product.save();
    console.log("Product created successfully:", saved._id);
    return saved;
  } catch (error) {
    // Ensure we log the original error stack for debugging
    console.error(
      "Create Product Error:",
      error && (error.stack || error.message || error)
    );
    // Re-throw a friendly error (controller will handle response)
    throw new Error(
      error.message || "Something went wrong while creating product"
    );
  }
};

const deleteProduct = async (productId) => {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  await Product.findByIdAndDelete(productId);

  return "Product deleted Successfully";
};

// Update a product by ID
// Update a product by ID
const updateProduct = async (productId, req) => {
  const reqData = req.body;
  const files = req.files;

  // 1. Process Sizes
  let sizes = reqData.size;
  if (typeof sizes === "string") {
    try {
      sizes = JSON.parse(sizes);
    } catch (e) {
      /* ignore */
    }
  }

  // 2. Process Images
  let imageUrls = [];
  // Existing images
  if (reqData.existingImageUrls) {
    try {
      const existing = JSON.parse(reqData.existingImageUrls);
      if (Array.isArray(existing)) imageUrls = [...existing];
    } catch (e) {
      imageUrls.push(reqData.existingImageUrls);
    }
  }

  // New uploads
  let newThumbnailUrl = null;
  if (files) {
    const imageFiles =
      files.images ||
      (Array.isArray(files)
        ? files.filter((f) => f.fieldname === "images")
        : []) ||
      [];
    const thumbnailFiles =
      files.thumbnail ||
      (Array.isArray(files)
        ? files.filter((f) => f.fieldname === "thumbnail")
        : []) ||
      [];

    const uploadToCloudinaryWithStatus = (file, options = {}) =>
      uploadToCloudinary(file, options)
        .then((r) => ({ ok: true, r, field: file.fieldname }))
        .catch((err) => ({ ok: false, err, field: file.fieldname }));

    const allFiles = [...imageFiles, ...thumbnailFiles];
    if (allFiles.length > 0) {
      const uploadResults = await Promise.all(
        allFiles.map((f) =>
          uploadToCloudinaryWithStatus(f, { folder: "ecommerce/products" })
        )
      );

      const newUrls = uploadResults
        .filter((u) => u.ok && u.field === "images")
        .map((u) => u.r.secure_url || u.r.url);
      imageUrls = [...imageUrls, ...newUrls];

      const thumbResult = uploadResults.find(
        (u) => u.ok && u.field === "thumbnail"
      );
      if (thumbResult) newThumbnailUrl = thumbResult.r.secure_url;
    }
  }

  // 3. Resolve Category if provided
  let categoryId;
  if (
    reqData.topLevelCategory ||
    reqData.secondLevelCategory ||
    reqData.thirdLevelCategory
  ) {
    const topLevel =
      (await Category.findOne({ name: reqData.topLevelCategory })) ||
      (await new Category({ name: reqData.topLevelCategory, level: 1 }).save());

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

    categoryId = thirdLevel._id;
  }

  // 4. Construct Update Data
  const updateData = {
    title: reqData.title,
    description: reqData.description,
    price: reqData.price,
    discountedPrice: reqData.discountedPrice,
    discountPersent: reqData.discountPercentage || reqData.discountPersent,
    quantity: reqData.quantity,
    brand: reqData.brand,
    color: reqData.color,
    sizes: sizes,
    imageUrl: imageUrls,
  };

  if (newThumbnailUrl) {
    updateData.thumbnail = newThumbnailUrl;
  } else if (reqData.existingThumbnailUrl) {
    updateData.thumbnail = reqData.existingThumbnailUrl;
  }

  if (categoryId) {
    updateData.category = categoryId;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
    }
  );
  return updatedProduct;
};

// Find a product by ID
const findProductById = async (id) => {
  const product = await Product.findById(id).populate("category").exec();

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
};

// Get all products with filtering and pagination
const getAllProducts = async (reqQuery = {}) => {
  let {
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

  pageSize = pageSize || 10;
  pageNumber = pageNumber || 1;

  // Build filter object
  let filter = {};

  if (category) {
    const existCategory = await Category.findOne({ name: category });
    if (existCategory) {
      filter.category = existCategory._id;
    } else {
      return { content: [], currentPage: 1, totalPages: 0 };
    }
  }

  if (color) {
    const colorSet = new Set(
      color.split(",").map((color) => color.trim().toLowerCase())
    );
    const colorRegex =
      colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
    if (colorRegex) filter.color = { $regex: colorRegex };
  }

  if (sizes) {
    const sizesSet = new Set(sizes);
    filter["sizes.name"] = { $in: [...sizesSet] };
  }

  if (minPrice && maxPrice) {
    filter.discountedPrice = { $gte: minPrice, $lte: maxPrice };
  }

  if (minDiscount) {
    filter.discountPersent = { $gt: minDiscount };
  }

  if (stock) {
    if (stock === "in_stock") {
      filter.quantity = { $gt: 0 };
    } else if (stock === "out_of_stock") {
      filter.quantity = { $lte: 0 };
    }
  }

  // Count total documents with filter
  const totalProducts = await Product.countDocuments(filter);

  // Build query with filter and populate
  let query = Product.find(filter).populate("category");

  if (sort) {
    const sortDirection = sort === "price_high" ? -1 : 1;
    query = query.sort({ discountedPrice: sortDirection });
  }

  // Apply pagination
  const skip = (pageNumber - 1) * pageSize;
  query = query.skip(skip).limit(pageSize);

  const products = await query.exec();

  const totalPages = Math.ceil(totalProducts / pageSize);

  return { content: products, currentPage: pageNumber, totalPages: totalPages };
};

const createMultipleProduct = async (products) => {
  for (let product of products) {
    await createProduct(product);
  }
};

const searchProducts = async (query) => {
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
};

// Find products by category (implementation missing previously)
const findProductByCategory = async (category) => {
  return await getProductsByCategoryName(category);
};

export {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
  searchProducts,
  findBestProduct,
  getProductInfo,
  getProductsByCategoryName,
  findProductByCategory, // Export added
  resolveProductFromQuery,
};
