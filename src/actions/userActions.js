import {
    USER_AUTH,
    USER_LIKES,
    USER_FOLLOWERS,
    USER_FOLLOWING,
    USER_PLAY_HISTORY,
    LOGIN_USER_SUCCESS,
    USER_AUTH_LOADING,
    UPDATE_USER_LIKES,
} from '../constants'

import store from '../store'
import appBase from '../secret'
import axios from 'axios'


export const userLoginSuccess = (userObj) => dispatch => {
    dispatch
        ({
            type: LOGIN_USER_SUCCESS,
            payload: userObj
        })
}

export const userAuthLoading = (loadingStatus) => dispatch => {
    dispatch
        ({
            type: USER_AUTH_LOADING,
            payload: loadingStatus
        })
}


export const toggleTrackLike = (track) => dispatch => {
    const user = store.getState().user
    const userId = user.userProfile.id
    const userLikeList = { ...user.userLikes }
    const trackId = track.trackId
    let requestType = ''
    if (userLikeList[track.trackId]) {
        delete userLikeList[track.trackId]
        requestType = 'DELETE'
    } else {
        userLikeList[track.trackId] = track
        requestType = 'PUT'
    }

    dispatch({
        type: UPDATE_USER_LIKES,
        payload: userLikeList
    })


    axios({
        method: requestType,
        url: appBase.proxyURL + `https://api-v2.soundcloud.com/users/${userId}/track_likes/${trackId}?client_id=${appBase.clientId}`,
        data: {},
    }).then(response => {
        if (response.status !== 200) {
            delete userLikeList[track.trackId]
            dispatch({
                type: UPDATE_USER_LIKES,
                payload: userLikeList
            })
        }
    }).catch(err => {
        console.log(err)
    })
}