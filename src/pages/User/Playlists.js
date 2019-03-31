import React, { Component } from 'react'

import appBase from '../../secret'

import { PlaylistItem, PlaylistInfo } from '../../components'

import ViewHOC from '../../containers/ViewHOC'

import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { setPlaylist, playAudio } from '../../actions'

import {
    getPlaylist
} from '../../utils'

class Playlists extends Component {

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
        const { userId, user, type } = this.props
        const { userProfile } = user
        if (userId !== userProfile.id) {
            const { initView } = this.props
            const url = type === 'playlist' ?
                `https://api-v2.soundcloud.com/users/${userId}/playlists_without_albums?client_id=${appBase.clientId}&limit=40`
                :
                `https://api-v2.soundcloud.com/users/${userId}/albums?client_id=${appBase.clientId}&limit=40`
            initView(url)
        }
    }

    handlePlaylistPlay = (playlistId) => {
        const { type, data } = this.props
        if (type === 'ablum') {
            const playlistInfo = data.find(a => a.id === playlistId)
            playlistInfo = { ...playlistInfo, trackList: playlistInfo.tracks.map(t => t) }
            console.log(playlistInfo, 33)
            this.props.setPlaylist(playlistInfo.trackList, 0, playlistId)
            return
        }

        getPlaylist(playlistId)
            .then(trackList => {
                console.log(trackList, 22)
                this.props.setPlaylist(trackList, 0, playlistId)
            })
    }

    fetchPlaylistInfo = (playlistId) => {
        const { type, data } = this.props
        if (type === 'album') {
            const playlistInfo = data.find(a => a.id === playlistId)
            this.setState({
                showPlaylistInfo: true,
                playlistInfo: playlistInfo
            })
            return
        }

        if (!this.playlistInfoObj[playlistId]) {
            getPlaylist(playlistId, true)
                .then(response => {
                    this.playlistInfoObj = { ...this.playlistInfoObj, [playlistId]: response }
                    this.setState({
                        showPlaylistInfo: true,
                        playlistInfo: response
                    })
                })
        } else {
            this.setState({
                showPlaylistInfo: true,
                playlistInfo: this.playlistInfoObj[playlistId]
            })
        }
    }

    render() {
        const { firstLoad, user, userId, data = [], type } = this.props
        const { userProfile, userPlaylist } = user
        const selfUser = userId === userProfile.id
        const { showPlaylistInfo, playlistInfo } = this.state

        return (
            <>
                <div className="user-container--bottom--content--likes">
                    {
                        (selfUser && type === 'playlist') ?
                            userPlaylist.map(item => {
                                return (
                                    <PlaylistItem
                                        item={item}
                                        key={item.id}
                                        selfUser={selfUser}
                                        onPlayClick={(playlistId) => { console.log(22); this.handlePlaylistPlay(playlistId) }}
                                        onPauseClick={(activeTrackId) => { console.log(11); playAudio(activeTrackId) }}
                                        getPlaylistInfo={(playlistId) => this.fetchPlaylistInfo(playlistId)}
                                    />
                                )
                            })
                            :
                            data.map(item => {
                                return (
                                    <PlaylistItem
                                        item={item}
                                        key={item.id}
                                        selfUser={selfUser}
                                        onPlayClick={(playlistId) => { console.log(55); this.handlePlaylistPlay(playlistId) }}
                                        onPauseClick={(activeTrackId) => { console.log(99); playAudio(activeTrackId) }}
                                        getPlaylistInfo={(playlistId) => this.fetchPlaylistInfo(playlistId)}
                                    />
                                )
                            })
                    }
                </div>
                <ReactCSSTransitionGroup
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                    transitionName="message"
                >
                    {
                        showPlaylistInfo &&
                        <PlaylistInfo
                            playlistInfo={playlistInfo}
                            onClose={() => this.setState({ showPlaylistInfo: false })}
                            key={`playlistinfo_show_${showPlaylistInfo}`}
                        />
                    }
                </ReactCSSTransitionGroup>
            </>
        )
    }
}

const mapStateToProps = function (state) {
    return { user: state.user }
}

Playlists = withRouter(connect(mapStateToProps, { setPlaylist, playAudio })(ViewHOC(Playlists)))

export default Playlists