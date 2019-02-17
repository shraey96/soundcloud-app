import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

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

    }

    render() {
        return (
            <div className="app-home-container">
                <p>Test</p>
            </div>
        );
    }
}


const mapStateToProps = function (state) {
    return state.user
}

Home = (connect(mapStateToProps, { userLoginSuccess })(Home))

export { Home };