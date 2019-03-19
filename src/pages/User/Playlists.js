import React, { Component } from 'react'

import appBase from '../../secret'

import { PlaylistItem } from '../../components'

import ViewHOC from '../../containers/ViewHOC'

import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import { setPlaylist, playAudio } from '../../actions'

import {
    getPlaylist
} from '../../utils'

class Playlists extends Component {

    constructor() {
        super()
        this.state = {
            activePlayList: null
        }
    }

    componentDidMount() {
        const { userId, userProfile } = this.props
        if (userId !== userProfile.id) {
            const { initView, userId } = this.props
            initView(`https://api-v2.soundcloud.com/users/${userId}/playlists_without_albums?client_id=${appBase.clientId}&limit=40`)
        }
    }

    handlePlaylistPlay = (playlistId) => {
        this.setState({
            activePlayList: playlistId
        }, () => {
            getPlaylist(playlistId)
                .then(trackList => {
                    console.log(trackList)
                    this.props.setPlaylist(trackList)
                    this.props.playAudio(trackList[0].track_id)
                })
        })
    }

    render() {
        const { firstLoad, userId, userProfile, userPlaylist, data = [] } = this.props
        const selfUser = userId === userProfile.id
        const { activePlayList } = this.state
        console.log(this.props)
        return (
            <div className="user-container--bottom--content--likes">
                {
                    selfUser ?
                        userPlaylist.map(item => {
                            return (
                                <PlaylistItem
                                    item={item}
                                    key={item.id}
                                    selfUser={selfUser}
                                    onPlayClick={(playlistId) => this.handlePlaylistPlay(playlistId)}
                                    activePlayList={activePlayList}
                                    onPauseClick={(activeTrackId) => this.playAudio(activeTrackId)}
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
                                />
                            )
                        })
                }
            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return state.user
}

Playlists = withRouter(connect(mapStateToProps, { setPlaylist, playAudio })(ViewHOC(Playlists)))

export default Playlists