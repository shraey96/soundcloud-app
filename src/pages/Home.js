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
            playListDiscover: [],
            moreOfWhatYouLikeTracks: []
        }
    }

    componentDidMount() {
        this.fetchData()
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
                    this.setState({
                        loading: false,
                        playListDiscover: response.data.collection.filter(p => p.tracking_feature_name === "playlist-discovery"),
                        moreOfWhatYouLikeTracks: response.data.collection.filter(t => t.tracking_feature_name === "personalized-tracks")
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        })
    }

    render() {
        const { loading, playListDiscover } = this.state
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