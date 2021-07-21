import { combineReducers } from "redux";
import auth from "registry-auth-token";
import authReducer from  './authReducer'

export default combineReducers({
    auth: authReducer
})