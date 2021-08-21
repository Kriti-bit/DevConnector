import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types';

//Get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());
    axios.get('/api/profile')
      .then(res=>{
          dispatch({
              type: GET_PROFILE,
              payload: res.data
          })
      })
         .catch(err=>
                dispatch({
                    type: GET_ERRORS,
                    payload: {} //Empty in case of errors as there is no profile
                })
            )
}

//Profile Loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING,
    }
}

//Clear Profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE,
    }
}