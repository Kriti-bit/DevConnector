import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS } from './types';

//Get current profilr
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
                    type: GET_PROFILE,
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