import React from 'react'
import { withRouter } from 'react-router-dom'
import {
    MdPlayArrow, MdPause, MdClose
} from 'react-icons/md'


const TrackList = withRouter(({ data, history }) => {

    return (
        <div className="playlist-info-container--tracks">
            {
                data.map((track, index) => {
                    const trackArtItem = track.track.artwork_url && track.track.artwork_url.replace('large.jpg', 't300x300.jpg') || require('../static/artwork_alt.png')
                    return (
                        <div className="playlist-info-container--tracks--item">
                            <p>Test</p>
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
    )
})

export { TrackList }