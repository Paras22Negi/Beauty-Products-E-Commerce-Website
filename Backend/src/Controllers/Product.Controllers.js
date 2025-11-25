import * as productServices from "../services/product.services-temp.js";

const createProduct = async (req, res) => {
    try {
        const product = await productServices.createProduct(req);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createProduct };
