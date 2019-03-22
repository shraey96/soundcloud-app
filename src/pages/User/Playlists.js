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
        const { userId, userProfile, type } = this.props
        if (userId !== userProfile.id) {
            const { initView, userId } = this.props
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
            this.setState({
                activePlayList: playlistId
            }, () => {
                this.props.setPlaylist(playlistInfo.trackList)
                this.props.playAudio(playlistInfo.trackList[0].track_id)
            })
            return
        }

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
        const { firstLoad, userId, userProfile, userPlaylist, data = [], type } = this.props
        const selfUser = userId === userProfile.id
        const { activePlayList, showPlaylistInfo, playlistInfo } = this.state
        console.log(this.props)
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
                                        onPlayClick={(playlistId) => this.handlePlaylistPlay(playlistId)}
                                        activePlayList={activePlayList}
                                        onPauseClick={(activeTrackId) => this.playAudio(activeTrackId)}
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
                                        onPlayClick={(playlistId) => this.handlePlaylistPlay(playlistId)}
                                        activePlayList={activePlayList}
                                        onPauseClick={(activeTrackId) => this.playAudio(activeTrackId)}
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
    return state.user
}

Playlists = withRouter(connect(mapStateToProps, { setPlaylist, playAudio })(ViewHOC(Playlists)))

export default Playlists