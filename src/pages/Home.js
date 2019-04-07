import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import appBase from '../secret'

import { DiscoverPlaylist } from '../components'

import { userLoginSuccess } from '../actions'

class Home extends Component {

    constructor() {
        super()
        this.state = {
            loading: false,
            playListDiscover: sessionStorage.getItem('home_data') !== null ? JSON.parse(sessionStorage.getItem('home_data')).playListDiscover : [],
            moreOfWhatYouLikeTracks: sessionStorage.getItem('home_data') !== null ? JSON.parse(sessionStorage.getItem('home_data')).moreOfWhatYouLikeTracks : []
        }
    }

    componentDidMount() {
        const { playListDiscover, moreOfWhatYouLikeTracks } = this.state
        if (playListDiscover.length === 0 || moreOfWhatYouLikeTracks.length === 0)
            this.fetchData()
    }

    componentDidUpdate(prevProps) {
        const { playListDiscover, moreOfWhatYouLikeTracks } = this.state
        if (this.props.userProfile.id !== prevProps.userProfile.id) {
            if (playListDiscover.length === 0 || moreOfWhatYouLikeTracks.length === 0)
                this.fetchData()
        }
    }

    fetchData = () => {
        this.setState({
            loading: false
        }, () => {
            axios.get(appBase.proxyURL + `https://api-v2.soundcloud.com/selections?client_id=${appBase.clientId}&limit=10&offset=0`)
                .then((response) => {
                    console.log(response)
                    this.setState({
                        loading: false,
                        // playListDiscover: response.data.collection.filter(p => p.tracking_feature_name === "playlist-discovery"),
                        // moreOfWhatYouLikeTracks: response.data.collection.filter(t => t.tracking_feature_name === "personalized-tracks")
                        // playListDiscover: response.data.collection.filter(p => p.tracking_feature_name === 'personalized-tracks')[0].system_playlists
                    }, () => {
                        const sessionObj = {
                            playListDiscover: this.state.playListDiscover,
                            moreOfWhatYouLikeTracks: this.state.moreOfWhatYouLikeTracks,
                        }
                        // sessionStorage.setItem('home_data', JSON.stringify(sessionObj))
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }

    render() {
        const { loading, playListDiscover } = this.state
        console.log(playListDiscover)
        return (
            <>
                {
                    !loading && playListDiscover.length > 0 &&
                    (
                        playListDiscover.map((item) => {

                            return <DiscoverPlaylist playlistItem={item} key={item.id} title={item.title} />
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

export { Home }