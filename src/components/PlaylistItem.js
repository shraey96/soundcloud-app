import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import {
    MdPlayArrow, MdPause,
} from 'react-icons/md'

let PlaylistItem = ({ item, activePlayList, selfUser, onPlayClick, onPauseClick, isAudioPlaying, activeTrackId, getPlaylistInfo }) => {

    let trackObj = {}
    if (selfUser) {
        trackObj = {
            artwork_url: item.playlist.artwork_url && item.playlist.artwork_url.replace('large.jpg', 't300x300.jpg') || require('../static/artwork_alt.png'),
            title: item.playlist.title,
            permalink: item.playlist.permalink,
            user: item.user,
            id: item.playlist.id
        }
    } else {
        trackObj = {
            artwork_url: item.artwork_url && item.artwork_url.replace('large.jpg', 't300x300.jpg') || require('../static/artwork_alt.png'),
            title: item.title,
            permalink: item.permalink,
            user: item.user,
            id: item.id
        }
    }


    return (
        <div className="track-item-container" key={trackObj.id}>
            <img
                src={trackObj.artwork_url}
            />
            <span
                className="track-item-container--title"
                onClick={() => getPlaylistInfo(trackObj.id)}
            >
                {trackObj.title}
            </span>
            {
                (activePlayList !== null && (activePlayList === trackObj.id) && isAudioPlaying)
                    ?
                    <MdPause
                        className="track-item-container--control play"
                        onClick={() => onPauseClick(activeTrackId)}
                    />
                    :
                    <MdPlayArrow
                        className="track-item-container--control pause"
                        onClick={() => onPlayClick(trackObj.id)}
                    />
            }
        </div>
    )
}


const mapStateToProps = function (state) {
    return state.player
}

PlaylistItem = connect(mapStateToProps, null)(PlaylistItem)

export { PlaylistItem }