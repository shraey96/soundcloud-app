import React, { Component } from 'react'
import { connect } from 'react-redux'

import { AudioPlayer } from '../components'

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

    render() {
        return (
            <div />
        );
    }
}


const mapStateToProps = function (state) {
    return state.user
}

Home = (connect(mapStateToProps, { userLoginSuccess })(Home))

export { Home };