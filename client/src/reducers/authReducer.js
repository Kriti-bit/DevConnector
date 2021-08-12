import isEmpty from '../validation/is-empty';

import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
    isAuthenticated : false,
    user : {}
};

export default function(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                ...payload,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            }
        default:
            return state;
    }
}