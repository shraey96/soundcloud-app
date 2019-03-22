import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { formatAudioTime } from '../utils'

import {
    MdPlayArrow, MdPause, MdClose
} from 'react-icons/md'


let PlaylistInfo = ({ playlistInfo, activeTrackId, index, playTrack, pauseTrack, onClose, history }) => {

    console.log(playlistInfo)

    const artworkBg = playlistInfo.artwork_url && playlistInfo.artwork_url.replace('large.jpg', 't500x500.jpg') || require('../static/imgs/img_2.jpeg')
    const artworkImg = playlistInfo.artwork_url && playlistInfo.artwork_url.replace('large.jpg', 't300x300.jpg') || require('../static/artwork_alt.png')

    return (
        <div>
            <div className="playlist-info-overlay" style={{ background: `url(${artworkBg})` }} />
            <div className="playlist-info-container">
                <MdClose
                    className="playlist-info-container--close"
                    onClick={() => onClose()}
                />
                <div className="playlist-info-container--header">
                    <div className="playlist-info-container--header--cover">
                        <img src={artworkImg} className="playlist-info-container--header--cover--img" />
                        {
                            (activeTrackId !== null && (activeTrackId === 11))
                                ?
                                <MdPause
                                    className="playlist-info-container--header--cover--control"
                                    onClick={() => console.log(123)}
                                />
                                :
                                <MdPlayArrow
                                    className="playlist-info-container--header--cover--img"
                                    onClick={() => console.log(321)}
                                />
                        }
                    </div>
                    <div className="playlist-info-container--header--info">
                        <span>{playlistInfo.title}</span>
                        <span>{playlistInfo.user.username}</span>
                        <span>{(playlistInfo.trackList || playlistInfo.tracks || []).length} tracks ({formatAudioTime(playlistInfo.duration / 1000)})</span>
                    </div>
                </div>
                <div className="playlist-info-container--tracks">
                    {
                        (playlistInfo.trackList || playlistInfo.tracks || []).map((track, index) => {
                            const trackArtItem = track.track.artwork_url && track.track.artwork_url.replace('large.jpg', 't300x300.jpg') || require('../static/artwork_alt.png')
                            return (
                                <div className="playlist-info-container--tracks--item">
                                    <div className="playlist-info-container--tracks--item--cover-container">
                                        <img src={trackArtItem} className="playlist-info-container--tracks--item--cover-container--img" />
                                        <MdPause
                                            className="playlist-info-container--tracks--item--cover-container--control"
                                            onClick={() => console.log(123)}
                                        />
                                        {/* :
                                        <MdPlayArrow
                                            className="playlist-info-container--header--cover--cover-container--control"
                                            onClick={() => console.log(321)}
                                        /> */}
                                    </div>
                                    <div className="playlist-info-container--tracks--item--info">
                                        {track.track.title}
                                        <span onClick={() => history.push(`/user/${track.track.user.permalink}`, { userId: track.track.user.id })}>
                                            {track.track.user.username}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = function (state) {
    return state.player
}

PlaylistInfo = withRouter(connect(mapStateToProps, null)(PlaylistInfo))

export { PlaylistInfo }