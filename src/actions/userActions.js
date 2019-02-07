import {
    USER_AUTH,
    USER_LIKES,
    USER_FOLLOWERS,
    USER_FOLLOWING,
    USER_PLAY_HISTORY,
    LOGIN_USER_SUCCESS
} from '../constants'

export const userLoginSuccess = (userObj) => {
    return dispatch => {
        dispatch
            ({
                type: LOGIN_USER_SUCCESS,
                payload: userObj
            })
    }
}