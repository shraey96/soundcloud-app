import React, { Component } from 'react'
import { connect } from 'react-redux'

import { NavLink, withRouter } from 'react-router-dom'
import Slider from 'react-slick'
import { setPlaylist, playAudio } from '../actions'

import {
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo,
    getUserPlaylist,
    updatePlayhistory,
    getPlaylist
} from '../utils'

import {
    MdSkipNext, MdSkipPrevious,
    MdPlayArrow, MdPause,
} from 'react-icons/md'


class DiscoverPlaylist extends Component {

    constructor() {
        super()
        this.state = {
            activePlayList: null
        }
    }


    scrollContainer = (type = "right") => {
        // this.discoverContainerRef.scrollLeft = 500
        // const containerScrollOffset = this.discoverContainerRef.scrollLeft === 0 ? 500 : this.discoverContainerRef.scrollLeft
        // console.log(containerScrollOffset, type)
        // if (type === "right") {
        //     console.log(containerScrollOffset, type)
        //     this.discoverContainerRef.scrollLeft = containerScrollOffset + (140 * 5)
        // } else if (type === "left") {
        //     console.log(containerScrollOffset, type)
        //     this.discoverContainerRef.scrollLeft = containerScrollOffset - (140 * 5)
        // }
        document.querySelector('.discover-container').scrollLeft = 500
    }

    handlePlaylistPlay = (playlistId) => {
        this.setState({
            activePlayList: playlistId
        }, () => {
            getPlaylist(playlistId)
                .then(trackList => {
                    this.props.setPlaylist(trackList)
                    this.props.playAudio(trackList[0].track_id)
                })
        })
    }

    render() {
        const { playAudio, activeTrackId, isAudioPlaying } = this.props
        const { playlists } = this.props.playlistItem
        const { activePlayList } = this.state

        return (
            <div className="discover-container-parent">
                {/* <MdSkipPrevious
                    onClick={e => {
                        this.scrollContainer('left')
                    }}
                    className="icon-scroll left"
                /> */}
                <div className="discover-container"
                    ref={a => this.discoverContainerRef = a}
                >
                    {
                        playlists.map((item) => {
                            return (
                                <div className="discover-container--individual"
                                    key={item.id}
                                >
                                    <img src={(item.artwork_url && item.artwork_url.replace('large.jpg', 't300x300.jpg')) || require('../static/artwork_alt.png')} />
                                    <span className="discover-container--individual--title">{item.title}</span>
                                    <span className="discover-container--individual--user">
                                        {item.user.username}
                                    </span>
                                    {
                                        (activePlayList !== null && activePlayList === item.id && isAudioPlaying)
                                            ?
                                            <MdPause
                                                className="discover-container--individual--play"
                                                onClick={() => playAudio(activeTrackId)}
                                            />
                                            :
                                            <MdPlayArrow
                                                className="discover-container--individual--play"
                                                onClick={() => this.handlePlaylistPlay(item.id)}
                                            />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                {/* <MdSkipNext
                    onClick={e => {
                        this.scrollContainer('right')
                    }}
                    className="icon-scroll right"
                /> */}
            </div>
        )
    }

}

const mapStateToProps = function (state) {
    return state.player
}

DiscoverPlaylist = withRouter((connect(mapStateToProps, { setPlaylist, playAudio })(DiscoverPlaylist)))

export { DiscoverPlaylist }

// export { DiscoverPlaylist }