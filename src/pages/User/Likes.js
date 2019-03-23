import React, { Component } from 'react'

import appBase from '../../secret'

import { TrackItem } from '../../components'

import ViewHOC from '../../containers/ViewHOC'

import { setPlaylist, playAudio } from '../../actions'

import { connect } from 'react-redux'

import _ from 'lodash'

class Likes extends Component {

    constructor() {
        super()
        this.state = {
            userLikes: []
        }
    }

    componentDidMount() {
        const { initView, userId, userProfile, userLikes } = this.props
        if (userId !== userProfile.id) {
            initView(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${appBase.clientId}&limit=40`)
        } else if (JSON.stringify(userLikes).length > 0) {
            this.setUserLikes(userLikes)
        }
    }

    componentDidUpdate(prevProps) {
        if ((this.props.userAuth !== prevProps.userAuth) && (JSON.stringify(this.props.userLikes) !== JSON.stringify(prevProps.userLikes))) {
            this.setUserLikes(this.props.userLikes)
        }
    }

    setUserLikes = data => {
        let userLikes = []
        for (var key in data) {
            userLikes.push({ track: data[key] })
        }
        userLikes.sort((a, b) => {
            a = new Date(a.track.liked_date)
            b = new Date(b.track.liked_date)
            return a > b ? -1 : a < b ? 1 : 0
        })
        this.setState({
            userLikes
        })
    }

    handleTrackPlay = index => {
        const { userId, userProfile, data } = this.props
        const trackList = userId === userProfile.id ? this.state.userLikes : data
        const trackPlaylist = trackList.filter((item, i) => {
            if (i >= index) {
                return { ...item, track_id: item.track.id }
            }
        })
        this.props.setPlaylist(trackPlaylist)
        this.props.playAudio(trackPlaylist[0].track_id)
    }

    render() {
        const { data, userId, firstLoad, playAudio, userProfile } = this.props
        const { userLikes } = this.state
        const selfUser = userId === userProfile.id
        console.log(this.state, data)
        return (
            <div className="user-container--bottom--content--likes">
                {
                    (selfUser ? userLikes : data).length > 0 && (selfUser ? userLikes : data).map((item, index) => {
                        return (
                            <TrackItem
                                item={item}
                                key={item.track.id}
                                playTrack={(index) => this.handleTrackPlay(index)}
                                pauseTrack={(id) => playAudio(id)}
                                index={index}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

// export default ViewHOC(Likes)


const mapStateToProps = function (state) {
    return state.user
}

Likes = connect(mapStateToProps, { setPlaylist, playAudio })(ViewHOC(Likes))

export default ViewHOC(Likes)