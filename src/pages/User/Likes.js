import React, { Component } from 'react'

import appBase from '../../secret'

import { TrackItem } from '../../components'

import ViewHOC from '../../containers/ViewHOC'

import { setPlaylist, playAudio } from '../../actions'

import { connect } from 'react-redux'

class Likes extends Component {
    componentDidMount() {
        const { initView, userId } = this.props
        initView(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${appBase.clientId}&limit=40`)
    }

    handleTrackPlay = index => {
        const trackPlaylist = [...this.props.data].filter((item, i) => {
            if (i >= index) {
                return { ...item, track_id: item.track.id }
            }
        })
        this.props.setPlaylist(trackPlaylist)
        this.props.playAudio(trackPlaylist[0].track_id)
    }

    render() {
        const { data, firstLoad, playAudio } = this.props
        return (
            <div className="user-container--bottom--content--likes">
                {
                    data.length > 0 && data.map((item, index) => {
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


// const mapStateToProps = function (state) {
//     return state.user
// }

Likes = connect(null, { setPlaylist, playAudio })(ViewHOC(Likes))

export default ViewHOC(Likes)