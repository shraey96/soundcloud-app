import {
    USER_AUTH,
    USER_LIKES,
    USER_FOLLOWERS,
    USER_FOLLOWING,
    USER_PLAY_HISTORY,
    USER_SET_INFO,
    LOGIN_USER_SUCCESS
} from '../constants'

const initialState = {
    userAuth: false,
    userProfile: {},
    userFollowers: [],
    userFollowing: [],
    userLikes: {},
    userPlayHistory: {},
}


export default function (state = initialState, action) {

    console.log("User Reducer Called: ", action.type);

    switch (action.type) {
        case 'LOGIN_USER_SUCCESS':
            return {
                userAuth: true,
                ...action.payload
            }

        default:
            return state
    }
}