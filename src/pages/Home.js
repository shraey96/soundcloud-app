import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import { AudioPlayer, Sidebar } from '../components'

import {
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo
} from '../utils'

import { userLoginSuccess } from '../actions'

let SC = window.SC

class Home extends Component {

    constructor() {
        super()
        this.state = {
            isLoggedIn: false
        }
    }

    componentDidMount() {
        console.log('Mounted Home')
        if (localStorage.getItem('sc_accessToken') !== null) {
            axios.defaults.headers.common['Authorization'] = 'OAuth ' + localStorage.getItem('sc_accessToken');
            this.fetchUserData()
        }
    }

    fetchUserData = () => {
        getUserInfo()
            .then(async (userInfo) => {
                const [likedTracks, followers, followings, playHistory] = await Promise.all([getUserLikedTracks(null, userInfo.id), getUserFollowers(), getUserFollowings(), getUserPlayHistory()])
                this.props.userLoginSuccess({
                    userProfile: userInfo,
                    userFollowers: followers,
                    userFollowing: followings,
                    userLikes: likedTracks,
                    userPlayHistory: playHistory
                })
            })
    }



    handleAuth = () => {
        console.log(SC)
        SC.connect().then(() => {
            return SC.get('/me');
        }).then((me) => {
            console.log('Hello, ', me)
            this.setState({
                isLoggedIn: true
            })
        });
    }

    render() {
        console.log(this.props)
        return (
            <>
                {

                    (localStorage.getItem('sc_accessToken') === null)
                        ?
                        <button onClick={() => this.handleAuth()}>Login SoundCloud</button>
                        :
                        <AudioPlayer />
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