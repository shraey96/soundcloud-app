import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import appBase from '../secret'

import { DiscoverPlaylist } from '../components'

import {
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo
} from '../utils'

import { userLoginSuccess } from '../actions'

class Home extends Component {

    constructor() {
        super()
        this.state = {
            loading: false,
            playListDiscover: [],
            moreOfWhatYouLikeTracks: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.userProfile.id !== nextProps.userProfile.id) {
            this.fetchData()
        }
    }

    fetchData = () => {
        this.setState({
            loading: false
        }, () => {
            axios.get(appBase.proxyURL + `https://api-v2.soundcloud.com/selections?
            client_id=${appBase.clientId}&limit=10&offset=0`)
                .then((response) => {
                    console.log(response)
                    this.setState({
                        loading: false,
                        playListDiscover: response.data.collection.filter(p => p.tracking_feature_name === "playlist-discovery"),
                        moreOfWhatYouLikeTracks: response.data.collection.filter(t => t.tracking_feature_name === "personalized-tracks")
                    }, () => {
                        console.log(this.state)
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }

    render() {
        const { loading, playListDiscover } = this.state
        console.log('render', this.state)
        return (
            <>
                <div style={{ background: `url(${require('../static/imgs/img_1.jpeg')})` }} className="app-home-overlay" />
                {
                    !loading && playListDiscover.length > 0 &&
                    (
                        playListDiscover.map((item) => {
                            return (
                                <DiscoverPlaylist playlistItem={item} key={item.id} />
                            )
                        })
                    )
                }
            </>
        );
    }
}


const mapStateToProps = function (state) {
    return state.user
}

Home = (connect(mapStateToProps, { userLoginSuccess })(Home))

export { Home };