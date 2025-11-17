import {
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    FETCH_USER_DETAILS,
    FETCH_USER_DETAILS_SUCCESS,
    FETCH_USER_DETAILS_FAILURE,
    LOGOUT,
} from "./actionType";

const initialState = {
    token: localStorage.getItem("token") || null,
    user: null,
    loading: false,
    error: null,
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGNUP_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null 
            };

        case LOGIN_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null 
            };

        case FETCH_USER_DETAILS:
            return { 
                ...state,
                loading: true, 
                error: null 
            };

        case SIGNUP_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                error: null 
            };

        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return { 
                ...state, 
                loading: false,
                token: action.payload.token,
                error: null 
            };

        case FETCH_USER_DETAILS_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                user: action.payload, 
                error: null 
            };

        case SIGNUP_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        case LOGIN_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        case FETCH_USER_DETAILS_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        case LOGOUT:
            localStorage.removeItem("token");
            return { 
                ...state, 
                token: null, 
                user: null 
            };
            
        default:
            return state;
    }
};

export default accountReducer;