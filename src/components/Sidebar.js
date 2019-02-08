import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import {
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo
} from '../utils'

import { userLoginSuccess, setPlaylist, userAuthLoading } from '../actions'

let SC = window.SC

class Sidebar extends Component {

    constructor() {
        super()
        this.state = {

        }
    }

    componentDidMount() {
        console.log('Mounted Sidebar')
        if (localStorage.getItem('sc_accessToken') !== null) {
            axios.defaults.headers.common['Authorization'] = 'OAuth ' + localStorage.getItem('sc_accessToken');
            this.props.userAuthLoading(true)
            this.fetchUserData()
        }
    }


    handleAuth = () => {
        SC.connect().then(() => {
            this.fetchUserData()
        })
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
                    // userPlayHistory: playHistory
                })
                this.props.setPlaylist(playHistory)
                this.props.userAuthLoading(false)
            })
    }

    render() {
        const { userAuth, userProfile, loading } = this.props
        const { username, avatar_url } = userProfile
        console.log(this.props)

        if (loading) {
            return <h1>Loading ...</h1>
        }

        return (
            <nav className="sidebar-container">
                <div className="sidebar-top">
                    {userAuth ?
                        <div className="user-info-section">
                            <img src={avatar_url} alt="user-img" />
                            <p>{username}</p>
                        </div> :
                        <button onClick={() => this.handleAuth()}>Login SoundCloud</button>
                    }
                    <div className="public-section">
                        <NavLink to="/charts" activeClassName="selected">
                            Top 50
                    </NavLink>
                        <NavLink to="/explore" activeClassName="selected">
                            Explore
                    </NavLink>
                    </div>
                    {userAuth && <div className="user-private">
                        <NavLink to="/me/likes" activeClassName="selected">
                            Likes
                    </NavLink>
                        <NavLink to="/me/following" activeClassName="selected">
                            Following
                    </NavLink>
                        <NavLink to="/charts" activeClassName="selected">
                            Top 50
                    </NavLink>
                    </div>}
                </div>
                {userAuth && <div className="user-signout">

                </div>}
            </nav>
        )
    }
}

const mapStateToProps = function (state) {
    return state.user
}

Sidebar = (connect(mapStateToProps, { userLoginSuccess, setPlaylist, userAuthLoading })(Sidebar))

export { Sidebar };