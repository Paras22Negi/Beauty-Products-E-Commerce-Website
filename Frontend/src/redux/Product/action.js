import axios from 'axios';
import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FETCH_PRODUCTS_FAILURE, FETCH_PRODUCT_DETAIL_SUCCESS, FETCH_PRODUCT_DETAIL_REQUEST, FETCH_PRODUCT_DETAIL_FAILURE, SEARCH_PRODUCT_REQUEST, SEARCH_PRODUCT_SUCCESS, SEARCH_PRODUCT_FAILURE } from './actionType';


export const fetchProduct = () => async(dispatch)=>{
    dispatch({ type: FETCH_PRODUCTS_REQUEST })
    try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: res.data.products })
    } catch (error) {
        console.log("API Error:", error.message);
        dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message })
    }
}

export const fetchProductDetail = (id) => async(dispatch)=>{
    dispatch({ type: FETCH_PRODUCT_DETAIL_REQUEST })
    try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/id/${id}`
        );
        dispatch({ type: FETCH_PRODUCT_DETAIL_SUCCESS, payload: res.data})
    } catch (error) {
        dispatch({ type: FETCH_PRODUCT_DETAIL_FAILURE, payload: error.message })
    }
}

export const searchProduct = (query) => async(dispatch)=>{
    dispatch({ type: SEARCH_PRODUCT_REQUEST })
    try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/search?q=${query}`
        );
        dispatch({ type: SEARCH_PRODUCT_SUCCESS, payload: res.data.products })
    } catch (error) {
        dispatch({ type: SEARCH_PRODUCT_FAILURE, payload: error.message })
    }
}