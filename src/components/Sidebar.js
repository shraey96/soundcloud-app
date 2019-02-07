import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'

class Sidebar extends Component {

    constructor() {
        super()
        this.state = {

        }
    }


    render() {
        return (
            <nav className="sidebar-container">
                Sidebar
            </nav>
        )
    }
}

// const mapStateToProps = function (state) {
//     return state.player
// }

// AudioPlayer = (connect(mapStateToProps, { playAudio, setPlaylist })(AudioPlayer))

export { Sidebar };