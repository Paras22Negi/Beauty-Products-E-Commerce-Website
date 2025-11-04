import {ADD_SUPORT_FAILURE, ADD_SUPORT_REQUEST, ADD_SUPORT_SUCCESS} from "./actionType";

const initialState = {
    loading: false,
    error: null,
};

const supportReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SUPORT_REQUEST:
            return { ...state, loading: true, error: null };
        case ADD_SUPORT_SUCCESS:
            return { ...state, loading: false, error: null };
        case ADD_SUPORT_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default supportReducer;