import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../utils/setAuthToken'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

//Register User
export const registerUser = (userData, history) => dispatch => {
    axios.post('/api/user', userData)
    .then( res=> history.push('/login') )
    .catch( err => 
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        );
};

//Login - Get User Token
export const loginUser = userData => dispatch => {
    axios.post('/api/user/login', userData)
    .then( res=> {
        //Save to localStorage
        const{ token } = res.data;
        //Set token to localStorage
        localStorage.setItem('jwtToken',token);
        //Set token to Auth Header
        setAuthToken(token);
        //Decode Token to get user data
        const decoded = jwt_decode(token);
        //Set Current user
        dispatch(setCurrentUser(decoded));

    })
    .catch( err => 
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
        );
}

//Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

//Log out User
export const logoutUser = () => dispatch => {
    //Remove token from local storage
    localStorage.removeItem('jwtToken');

    //Remove auth header for future requests
    setAuthToken(false);

    //Set current user to {} empty object which will set isAuthenticated to false
    dispatch(setCurrentUser({}));    
}