import {
    USER_AUTH,
    USER_LIKES,
    USER_FOLLOWERS,
    USER_FOLLOWING,
    USER_PLAY_HISTORY,
    USER_SET_INFO,
    LOGIN_USER_SUCCESS,
    USER_AUTH_LOADING
} from '../constants'

const initialState = {
    userAuth: localStorage.getItem('sc_accessToken') !== null,
    userProfile: {},
    userFollowers: [],
    userFollowing: [],
    userLikes: {},
    userPlayHistory: {},
    loading: false
}


export default function (state = initialState, action) {
    switch (action.type) {
        case 'USER_AUTH_LOADING':
            return {
                ...state,
                loading: action.payload
            }

        case 'LOGIN_USER_SUCCESS':
            return {
                userAuth: true,
                loading: false,
                ...action.payload
            }

        default:
            return state
    }
}