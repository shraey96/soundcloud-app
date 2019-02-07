import {
    PLAY_AUDIO,
    ENABLE_SHUFFLE,
    SET_PLAYLIST,
    ADD_TRACK
} from '../constants'

export const playAudio = (trackID) => {
    return dispatch => {
        dispatch
            ({
                type: PLAY_AUDIO,
                payload: trackID
            })
    }
}

export const toggleShuffle = () => {
    return dispatch => {
        dispatch
            ({
                type: ENABLE_SHUFFLE
            })
    }
}

export const setPlaylist = (playList = []) => {
    return dispatch => {
        dispatch
            ({
                type: SET_PLAYLIST,
                payload: playList
            })
    }
}

// export {
//     playAudio,
//     toggleShuffle,
//     setPlaylist
// }