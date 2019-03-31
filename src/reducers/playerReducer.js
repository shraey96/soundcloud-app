import {
    PLAY_AUDIO,
    ENABLE_SHUFFLE,
    SET_PLAYLIST,
    ADD_TRACK,
    REORDER_PLAYLIST,
    REORDER_PLAYLIST_TOGGLE,
    SET_TRACK_INDEX
} from '../constants'

const initialState = {
    isAudioPlaying: false,
    playlist: [],
    activeTrackId: null,
    activePlaylistId: null,
    activeTrackIndex: 0,
    nextUpIndex: 0,
    isShuffleMode: false,
    playListReOrder: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'PLAY_AUDIO':
            return {
                ...state,
                isAudioPlaying: !state.isAudioPlaying,
                activeTrackId: action.payload
            }
        case 'ENABLE_SHUFFLE':
            return { ...state, isShuffleMode: !state.isAudioPlaying }
        case 'SET_PLAYLIST':
            return {
                ...state,
                playlist: action.payload.playList,
                activeTrackIndex: action.payload.trackIndex,
                activePlaylistId: action.payload.playListId
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
        case 'SET_TRACK_INDEX':
            let trackIndex;
            if (action.payload === 'inc') {
                trackIndex = state.activeTrackIndex + 1
            } else if (action.payload === 'dec') {
                trackIndex = state.activeTrackIndex - 1
            } else {
                trackIndex = 0
            }
            return {
                ...state,
                activeTrackIndex: trackIndex
            }

        default:
            return state
    }
}
