import {
    PLAY_AUDIO,
    ENABLE_SHUFFLE,
    SET_PLAYLIST,
    REORDER_PLAYLIST,
    REORDER_PLAYLIST_TOGGLE,
    ADD_TRACK, SET_TRACK_INDEX
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

export const setPlaylist = (playList = [], trackIndex = 0, playListId = null) => {
    return dispatch => {
        dispatch
            ({
                type: SET_PLAYLIST,
                payload: { playList, trackIndex, playListId }
            })
    }
}

export const setTrackIndex = (type = 'inc') => {
    return dispatch => {
        dispatch
            ({
                type: SET_TRACK_INDEX,
                payload: type
            })
    }
}

export const reOrderPlaylist = (playList = []) => {
    return dispatch => {
        dispatch
            ({
                type: REORDER_PLAYLIST,
                payload: playList
            })
        dispatch
            ({
                type: REORDER_PLAYLIST_TOGGLE,
            })
    }
}

export const toggleReorderPlaylist = () => {
    return dispatch => {
        dispatch
            ({
                type: REORDER_PLAYLIST_TOGGLE,
            })
    }
}