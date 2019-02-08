import {
    USER_AUTH,
    USER_LIKES,
    USER_FOLLOWERS,
    USER_FOLLOWING,
    USER_PLAY_HISTORY,
    LOGIN_USER_SUCCESS,
    USER_AUTH_LOADING
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

export const userAuthLoading = (loadingStatus) => {
    return dispatch => {
        dispatch
            ({
                type: USER_AUTH_LOADING,
                payload: loadingStatus
            })
    }
}