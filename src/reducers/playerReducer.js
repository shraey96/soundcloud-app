import {
    PLAY_AUDIO,
    ENABLE_SHUFFLE,
    SET_PLAYLIST,
    ADD_TRACK
} from '../constants'

const initialState = {
    isAudioPlaying: false,
    playlist: [],
    activeTrackId: {},
    isShuffleMode: false
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

        default:
            return state
    }
}
