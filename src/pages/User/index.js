import React, { Component } from 'react'
import { NavLink, withRouter, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import { formatNumber } from '../../utils'

import { setUserFollowing } from '../../actions'

import appBase from '../../secret'

import Likes from './Likes'
import Playlists from './Playlists'
import Follow from './Follow'

import _ from 'lodash'

class User extends Component {

    constructor() {
        super()
        this.state = {
            userId: null,
            userInfo: null,
            userSocial: []
        }
    }

    componentDidMount() {
        const { location, match, userProfile } = this.props

        if (userProfile.permalink && userProfile.permalink === match.params.permalink) {
            this.setState({
                userId: userProfile.id,
                userInfo: userProfile
            })
            return
        }

        if (!location.state) {
            this.handlePermalinkFetch(match.params.permalink)
        } else {
            Promise.all([this.fetchData(location.state.userId), this.fetchSocial(location.state.userId)])
                .then(info =>
                    this.setState({
                        userId: info[0].data.id,
                        userInfo: info[0].data,
                        userSocial: info[1].data
                    })
                ).catch(err => {
                    console.log(err)
                })

        }
    }

    componentDidUpdate(prevProps) {
        const { match, userProfile } = this.props
        if (prevProps.match.params.permalink !== match.params.permalink) {
            if (userProfile.permalink && userProfile.permalink === match.params.permalink) {
                this.setState({
                    userId: userProfile.id,
                    userInfo: userProfile
                })
                return
            }
            this.handlePermalinkFetch(match.params.permalink)
        }
    }

    handlePermalinkFetch = permalink => {
        this.fetchData(permalink)
            .then(async (info) => {
                const [userInfo, userSocial] = await Promise.all([this.fetchData(info.data.id), this.fetchSocial(info.data.id)])
                this.setState({
                    userId: info.data.id,
                    userInfo: userInfo.data,
                    userSocial: userSocial.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    fetchData = userId => {
        const type = typeof userId === 'string' ? 'v1' : 'v2'
        return axios.get(appBase.proxyURL + `https://${type === 'v1' ? 'api' : 'api-v2'}.soundcloud.com/users/${userId}?client_id=${appBase.clientId}`)
    }

    fetchSocial = userId => {
        return axios.get(appBase.proxyURL + `https://api-v2.soundcloud.com/users/soundcloud:users:${userId}/web-profiles?client_id=${appBase.clientId}`)
    }

    handleFollowToggle = async (followIndex, user) => {
        const { userFollowing } = this.props
        let updatedUserFollowing = [...userFollowing]
        let requestType = ''

        if (followIndex > -1) {
            requestType = 'delete'
            updatedUserFollowing = updatedUserFollowing.filter(u => u.id !== user.id)
        } else {
            requestType = 'post'
            updatedUserFollowing.unshift(user)
        }

        await axios({
            method: requestType,
            url: appBase.proxyURL + `https://api-v2.soundcloud.com/me/followings/${user.id}?client_id=${appBase.clientId}`,
            data: null
        }).catch(err => {
            console.log(err)
        })

        this.props.setUserFollowing(updatedUserFollowing)
    }

    render() {
        const { userInfo, userId, userSocial } = this.state
        const { userFollowers, userFollowing, userProfile } = this.props

        if (userInfo === null) {
            return ''
        }

        const userFollowIndex = _.findIndex(userFollowing, ['id', userInfo.id])

        return (
            <div className="user-container">
                <div
                    className="user-container--visual"
                    style={userInfo.visuals ? { background: `url(${userInfo.visuals.visuals[0].visual_url})` } : {}}
                >
                    <div className="user-container--visual--parent">
                        <img src={userInfo.avatar_url} alt="user" />
                        <div className="user-container--visual--parent--info">
                            <span>{userInfo.username}</span>
                            {userInfo.city && <span>{userInfo.city}</span>}
                            {
                                userInfo.description &&
                                <div className="user-container--visual--parent--info--desc">
                                    {userInfo.description}
                                </div>
                            }
                        </div>
                        <div className="user-container--visual--parent--social">
                            {
                                userSocial.map(social => {
                                    return (
                                        <a href={social.url}>{social.title}</a>
                                    )
                                })
                            }
                        </div>
                        <NavLink
                            exact to={`/user/${this.props.match.params.permalink}/following`}
                            activeClassName="active"
                            className="user-container--visual--parent--following"
                        >
                            {formatNumber(userInfo.followings_count)} Following
                            </NavLink>
                    </div>
                </div>
                <div className="user-container--sub">
                    <NavLink
                        exact to={`/user/${this.props.match.params.permalink}/followers`}
                        activeClassName="active"
                        className="user-container--visual--parent--followers"
                    >
                        {formatNumber(userInfo.followers_count)} Followers
                    </NavLink>

                    <div className="user-container--bottom--content--nav">
                        <NavLink
                            exact to={`/user/${this.props.match.params.permalink}`}
                            activeClassName="active"
                            className={`user-container--bottom--content--nav--link`}
                        >
                            Tracks
                            </NavLink>
                        <NavLink
                            exact to={`/user/${this.props.match.params.permalink}/albums`}
                            activeClassName="active"
                            className={`user-container--bottom--content--nav--link`}
                        >
                            Albums
                            </NavLink>
                        <NavLink
                            exact to={`/user/${this.props.match.params.permalink}/likes`}
                            activeClassName="active"
                            className="user-container--bottom--content--nav--link"
                        >
                            Likes
                            </NavLink>
                        <NavLink
                            exact to={`/user/${this.props.match.params.permalink}/playlists`}
                            activeClassName="active"
                            className="user-container--bottom--content--nav--link"
                        >
                            Playlists
                            </NavLink>
                        {
                            this.props.match.params.section === "followers" &&
                            <NavLink
                                exact to={`/user/${this.props.match.params.permalink}/followers`}
                                activeClassName="active"
                                className="user-container--bottom--content--nav--link"
                            >
                                Followers
                            </NavLink>
                        }
                        {
                            this.props.match.params.section === "following" &&
                            <NavLink
                                exact to={`/user/${this.props.match.params.permalink}/following`}
                                activeClassName="active"
                                className="user-container--bottom--content--nav--link"
                            >
                                Following
                            </NavLink>
                        }
                        <NavLink
                            exact to={`/user/${this.props.match.params.permalink}/stations`}
                            activeClassName="active"
                            className="user-container--bottom--content--nav--link"
                        >
                            Stations
                            </NavLink>
                    </div>
                    <button
                        onClick={() => this.handleFollowToggle(userFollowIndex, userInfo)}
                    >
                        {
                            userFollowIndex > -1 ?
                                'following' :
                                'follow'
                        }
                    </button>
                </div>
                <div className="user-container--bottom">
                    <div className="user-container--bottom--content">
                        <Switch>
                            <Route exact path="/user/:permalink/likes"
                                component={(props) => <Likes {...props} userId={userId} />} />
                            <Route exact path="/user/:permalink/playlists"
                                component={(props) => <Playlists {...props} userId={userId} type="playlist" />} />
                            <Route exact path="/user/:permalink/albums"
                                component={(props) => <Playlists {...props} userId={userId} type="album" />} />
                            <Route exact path="/user/:permalink/followers"
                                component={(props) =>
                                    <Follow
                                        {...props}
                                        userId={userId}
                                        type="followers"
                                        handleFollowToggle={(followIndex, user) => this.handleFollowToggle(followIndex, user)}
                                        userFollowers={userFollowers}
                                        userFollowing={userFollowing}
                                        userProfile={userProfile}
                                    />
                                }
                            />
                            <Route exact path="/user/:permalink/following"
                                component={(props) =>
                                    <Follow
                                        {...props}
                                        userId={userId}
                                        type="following"
                                        handleFollowToggle={(followIndex, user) => this.handleFollowToggle(followIndex, user)}
                                        userFollowers={userFollowers}
                                        userFollowing={userFollowing}
                                        userProfile={userProfile}
                                    />
                                }
                            />
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = function (state) {
    return state.user
}

User = withRouter(connect(mapStateToProps, { setUserFollowing })(User))

export { User }