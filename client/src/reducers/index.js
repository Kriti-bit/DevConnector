import { combineReducers } from "redux";
import auth from "registry-auth-token";
import authReducer from  './authReducer'
import errorReducer from "./errorReducer";

export default combineReducers({
    auth: authReducer,
    errors: errorReducer
})