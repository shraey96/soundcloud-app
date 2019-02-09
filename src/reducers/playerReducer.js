import {
    PLAY_AUDIO,
    ENABLE_SHUFFLE,
    SET_PLAYLIST,
    ADD_TRACK,
    REORDER_PLAYLIST,
    REORDER_PLAYLIST_TOGGLE,
} from '../constants'

const initialState = {
    isAudioPlaying: false,
    playlist: [],
    activeTrackId: null,
    isShuffleMode: false,
    playListReOrder: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'PLAY_AUDIO':
            return { ...state, isAudioPlaying: !state.isAudioPlaying, activeTrackId: action.payload }
        case 'ENABLE_SHUFFLE':
            return { ...state, isShuffleMode: !state.isAudioPlaying }
        case 'SET_PLAYLIST':
            return {
                ...state,
                playlist: action.payload,
            }
        case 'REORDER_PLAYLIST':
            return {
                ...state,
                playlist: action.payload,
                playListReOrder: true
            }
        case 'REORDER_PLAYLIST_TOGGLE':
            return {
                ...state,
                playListReOrder: !state.playListReOrder
            }

        default:
            return state
    }
}
