import React, { Component } from 'react'

import appBase from '../../secret'

import ViewHOC from '../../containers/ViewHOC'

import { connect } from 'react-redux'

import _ from 'lodash'

import { NavLink } from 'react-router-dom'

class Follow extends Component {

    componentDidMount() {
        const { initView, userId, userProfile, type } = this.props
        if (userId !== userProfile.id) {
            initView(`https://api-v2.soundcloud.com/users/${userId}/${type === 'followers' ? 'followers' : 'followings'}?client_id=${appBase.clientId}&limit=40&offset=0`)
        }
    }

    render() {
        const { data, userId, userProfile, type, userFollowers, userFollowing, handleFollowToggle } = this.props
        const selfUser = userId === userProfile.id
        const followArr = selfUser ? (type === 'followers' ? userFollowers : userFollowing) : data || []

        return (
            <div className="user-container--bottom--content--likes">
                {
                    followArr.length ?
                        followArr.map(u => {
                            const followIndex = _.findIndex(userFollowing, ['id', u.id])
                            return (
                                <>
                                    <div className="user-follow--item" key={u.id}>
                                        <NavLink
                                            exact to={`/user/${u.permalink}`}
                                            activeClassName="active"
                                        >
                                            <img src={u.avatar_url && u.avatar_url.replace('large', 't300x300') || require('../../static/user.png')} />
                                            {/* <img src={u.avatar_url && u.avatar_url || require('../../static/user.png')} /> */}
                                        </NavLink>
                                        <NavLink
                                            exact to={`/user/${u.permalink}`}
                                            activeClassName="active"
                                            className="user-follow"
                                        >
                                            {u.username}
                                        </NavLink>
                                        <button
                                            onClick={() => handleFollowToggle(followIndex, u)}
                                        >
                                            {followIndex > -1 ?
                                                'following' :
                                                'follow'}
                                        </button>
                                    </div>
                                </>
                            )
                        })
                        :
                        `no ${type}`
                }
            </div>
        )
    }
}

export default ViewHOC(Follow)