import axios from "axios";
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCT_DETAIL_SUCCESS,
  FETCH_PRODUCT_DETAIL_REQUEST,
  FETCH_PRODUCT_DETAIL_FAILURE,
  SEARCH_PRODUCT_REQUEST,
  SEARCH_PRODUCT_SUCCESS,
  SEARCH_PRODUCT_FAILURE,
} from "./actionType";

export const fetchProduct = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products`
    );
    // Backend returns { content: [...], currentPage, totalPages }
    const products = res.data.content || res.data.products || res.data || [];
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
  } catch (error) {
    console.log("API Error:", error.message, error.response?.status);
    // If 404, treat as empty products (not an error)
    if (error.response?.status === 404) {
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: [] });
    } else {
      const errorMessage = "Failed to load products. Please try again later.";
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: errorMessage });
    }
  }
};

export const fetchProductsByCategory = (category) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/category/${category}`
    );
    // Return empty array if no products found (instead of error)
    const products = res.data.content || res.data.products || res.data || [];
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
  } catch (error) {
    console.log("API Error:", error.message, error.response?.status);
    // If 404, it means no products in this category - not an error, just empty
    if (error.response?.status === 404) {
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: [] });
    } else {
      const errorMessage = "Failed to load products. Please try again later.";
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: errorMessage });
    }
  }
};

export const fetchProductDetail = (id) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_DETAIL_REQUEST });
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/id/${id}`
    );
    dispatch({ type: FETCH_PRODUCT_DETAIL_SUCCESS, payload: res.data });
  } catch (error) {
    const errorMessage =
      error.response?.status === 404
        ? "Product not found"
        : "Failed to load product details. Please try again later.";
    dispatch({ type: FETCH_PRODUCT_DETAIL_FAILURE, payload: errorMessage });
  }
};

export const searchProduct = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_PRODUCT_REQUEST });
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/search?q=${query}`
    );
    const products = res.data.content || res.data.products || res.data || [];
    dispatch({ type: SEARCH_PRODUCT_SUCCESS, payload: products });
  } catch (error) {
    console.log("Search API Error:", error.message, error.response?.status);
    // If 404, treat as no results (not an error)
    if (error.response?.status === 404) {
      dispatch({ type: SEARCH_PRODUCT_SUCCESS, payload: [] });
    } else {
      const errorMessage = "Search failed. Please try again later.";
      dispatch({ type: SEARCH_PRODUCT_FAILURE, payload: errorMessage });
    }
  }
};
