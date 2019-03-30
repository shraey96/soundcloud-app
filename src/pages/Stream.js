import React, { Component } from 'react'
import { connect } from 'react-redux'

import { NavLink, withRouter } from 'react-router-dom'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import smoothScroll from 'smoothscroll'

import { PlaylistInfo, TrackList } from '../components'

import ViewHOC from '../containers/ViewHOC'

import { setPlaylist, playAudio } from '../actions'

import {
    getPlaylist
} from '../utils'

import {
    MdKeyboardArrowRight, MdKeyboardArrowLeft,
    MdPlayArrow, MdPause,
} from 'react-icons/md'

import appBase from '../secret';


class Stream extends Component {

    constructor() {
        super()
        this.state = {
            activePlayList: null,
            showPlaylistInfo: false,
            playlistInfo: null
        }
        this.playlistInfoObj = {}
    }

    componentDidMount() {
        const { initView, userProfile } = this.props
        initView(`https://api-v2.soundcloud.com/stream?user_urn=soundcloud users ${userProfile.id}&promoted_playlist=true&client_id=${appBase.clientId}&limit=50`)
    }

    render() {
        console.log(this.props)
        const { data } = this.props
        const x = data.filter(d => d.type === 'track' || d.type === 'track-repost')
        return (
            <div className="user-stream">
                {
                    <TrackList
                        data={x}
                    />
                }
            </div>
        )
    }

}

const mapStateToProps = function (state) {
    return state.user
}

Stream = connect(mapStateToProps, null)(ViewHOC(Stream))

export { Stream }