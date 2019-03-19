import React, { Component } from 'react'
import { NavLink, withRouter, Switch, Route } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'

import appBase from '../../secret'

import Likes from './Likes'
import Playlists from './Playlists'

class User extends Component {

    constructor() {
        super()
        this.state = {
            userId: null,
            userInfo: null
        }
    }

    componentDidMount() {
        const { location, match } = this.props
        if (!location.state) {
            this.handlePermalinkFetch(match.params.permalink)
        } else {
            this.fetchData(location.state.userId)
                .then(info =>
                    this.setState({
                        userId: info.data.id,
                        userInfo: info.data
                    })
                )

        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.permalink !== this.props.match.params.permalink) {
            this.handlePermalinkFetch(this.props.match.params.permalink)
        }
    }

    handlePermalinkFetch = (permalink) => {
        this.fetchData(permalink)
            .then(info => {
                this.fetchData(info.data.id)
                    .then(info =>
                        this.setState({
                            userId: info.data.id,
                            userInfo: info.data
                        })
                    )
            })
    }

    fetchData = (userId) => {
        const type = typeof userId === 'string' ? 'v1' : 'v2'
        return axios.get(appBase.proxyURL + `https://${type === 'v1' ? 'api' : 'api-v2'}.soundcloud.com/users/${userId}?client_id=${appBase.clientId}`)
    }


    render() {
        const { userInfo, userId } = this.state

        if (userInfo === null) {
            return ''
        }

        console.log(this.props)
        return (
            <div className="user-container">
                <div
                    className="user-container--visual"
                    style={userInfo.visuals ? { background: `url(${userInfo.visuals.visuals[0].visual_url})` } : {}}
                >
                    <img src={userInfo.avatar_url} alt="user" />
                </div>
                <div className="user-container--sub">
                    <span>{userInfo.followers_count}</span>
                    <button>Follow</button>
                </div>
                <div className="user-container--bottom">
                    <div className="user-container--bottom--info">
                        <span>{userInfo.username}</span>
                        {userInfo.city && <span>{userInfo.city}</span>}
                        {userInfo.description && <span>{userInfo.description}</span>}
                    </div>
                    <div className="user-container--bottom--content">
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
                            <NavLink
                                exact to={`/user/${this.props.match.params.permalink}/stations`}
                                activeClassName="active"
                                className="user-container--bottom--content--nav--link"
                            >
                                Stations
                            </NavLink>
                            <NavLink
                                exact to={`/user/${this.props.match.params.permalink}/reposts`}
                                activeClassName="active"
                                className="user-container--bottom--content--nav--link"
                            >
                                Reposts
                            </NavLink>
                        </div>
                        <Switch>
                            <Route exact path="/user/:permalink/likes"
                                component={(props) => <Likes {...props} userId={userId} />} />
                            <Route exact path="/user/:permalink/playlists"
                                component={(props) => <Playlists {...props} userId={userId} />} />
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

User = withRouter(connect(mapStateToProps, null)(User))

export { User }