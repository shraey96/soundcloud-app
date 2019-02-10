import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import {
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo,
    getUserPlaylist
} from '../utils'

import { userLoginSuccess, setPlaylist, userAuthLoading } from '../actions'

let SC = window.SC

class Sidebar extends Component {

    constructor() {
        super()
        this.publicSections = [
            { label: 'Top 50', link: '/charts' },
            { label: 'Explore', link: '/explore' },
        ]
        this.privateSections = [
            { label: 'Likes', link: '/likes' },
            { label: 'Followers', link: '/followers' },
            { label: 'Following', link: '/following' },
        ]
        this.proxyUrl = 'https://cryptic-ravine-67258.herokuapp.com/'
    }

    componentDidMount() {
        if (localStorage.getItem('sc_accessToken') !== null) {
            this.fetchUserData()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userAuth && localStorage.getItem('sc_accessToken') === null) {
            this.fetchUserData()
        }
    }


    handleAuth = () => {
        SC.connect().then(() => {
            this.fetchUserData()
        })
    }

    fetchUserData = () => {
        axios.defaults.headers.common['Authorization'] = 'OAuth ' + localStorage.getItem('sc_accessToken');
        this.props.userAuthLoading(true)
        getUserInfo()
            .then(async (userInfo) => {
                const [likedTracks, followers, followings, playHistory, playList] = await Promise.all([getUserLikedTracks(null, userInfo.id), getUserFollowers(), getUserFollowings(), getUserPlayHistory(), getUserPlaylist(null, userInfo.id)])
                this.props.userLoginSuccess({
                    userProfile: userInfo,
                    userFollowers: followers,
                    userFollowing: followings,
                    userLikes: likedTracks,
                    userPlaylist: playList
                    // userPlayHistory: playHistory
                })
                this.props.setPlaylist(playHistory)
                this.props.userAuthLoading(false)
            })
    }

    setUserPlaylist = async (playlistId) => {
        const playlistTracks = await axios.get(this.proxyUrl + `https://api-v2.soundcloud.com/playlists/${playlistId}?representation=full&client_id=CoeTA81rlM4PNaXs33YeRXZZAixneGwv`)
        const trackList = [...playlistTracks.data.tracks].map((t) => {
            return {
                track_id: t.id,
                track: t
            }
        })
        console.log(trackList)
        this.props.setPlaylist(trackList)
    }

    render() {
        const { userAuth, userProfile, loading, userPlaylist } = this.props
        const { username, avatar_url } = userProfile
        console.log(this.props)

        if (loading) {
            return <h1>Loading ...</h1>
        }

        return (
            <nav className="sidebar-container">
                <div className="sidebar-top">
                    {
                        userAuth ?
                            <div className="user-info-section">
                                <img src={avatar_url} alt="user-img" />
                                <p>{username}</p>
                            </div> :
                            <button onClick={() => this.handleAuth()}>Login SoundCloud</button>
                    }
                    {
                        userAuth && <hr />
                    }
                    <div className={`public-section bottomPadding ${userAuth && 'topPadding'}`}>
                        {
                            this.publicSections.map((psec) => {
                                return (
                                    <div className="link-container" key={psec.link}>
                                        <NavLink exact to={psec.link} activeClassName="active">
                                            {psec.label}
                                        </NavLink>
                                        <span />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <hr />
                    {
                        userAuth &&
                        <>
                            <div className="user-private bottomPadding topPadding">
                                {
                                    this.privateSections.map((prsec) => {
                                        return (
                                            <div className="link-container" key={prsec.link}>
                                                <NavLink exact to={prsec.link} activeClassName="active">
                                                    {prsec.label}
                                                </NavLink>
                                                <span />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <hr />
                        </>
                    }
                    {
                        userAuth &&
                        <div className="user-playlist topPadding">
                            <p>Your Playlist</p>
                            <div className="user-playlist-container">
                                {
                                    userPlaylist.length > 0 && userPlaylist.map((track) => {
                                        return (
                                            <div className="user-playlist-item" key={track.uuid} onClick={e => this.setUserPlaylist(track.playlist.id)}>
                                                {track.playlist.title}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
                {
                    userAuth && <div className="user-signout">

                    </div>
                }
            </nav>
        )
    }
}

const mapStateToProps = function (state) {
    return state.user
}

Sidebar = withRouter((connect(mapStateToProps, { userLoginSuccess, setPlaylist, userAuthLoading })(Sidebar)))

export { Sidebar };