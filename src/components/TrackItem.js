import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import {
    MdPlayArrow, MdPause,
} from 'react-icons/md'

let TrackItem = ({ item, activeTrackId }) => {
    return (
        <div className="track-item-container">
            <img
                src={(item.track.artwork_url && item.track.artwork_url.replace('large.jpg', 't300x300.jpg'))
                    || require('../static/artwork_alt.png')}
            />
            <span className="track-item-container--title">{item.track.title}</span>
            <NavLink exact to={`/user/${item.track.user.permalink}`}
                className="track-item-container--user">
                {item.track.user.username}
            </NavLink>
            {
                (activeTrackId !== null && (activeTrackId === item.track.id))
                    ?
                    <MdPause
                        className="track-item-container--control play"
                        onClick={() => console.log('pause')}
                    />
                    :
                    <MdPlayArrow
                        className="track-item-container--control pause"
                        onClick={() => console.log('play')}
                    />
            }
        </div>
    )
}


const mapStateToProps = function (state) {
    return state.player
}

TrackItem = connect(mapStateToProps, null)(TrackItem)

export { TrackItem }