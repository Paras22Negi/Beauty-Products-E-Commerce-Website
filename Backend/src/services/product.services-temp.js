import Product from "../Models/Product.Model.js";

const createProduct = async (req) => {
    try {
        const product = await Product.create(productData);
        return product;
    } catch (error) {
        throw error;
    }
}

export { createProduct };