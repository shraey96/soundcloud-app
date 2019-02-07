import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'

import { formatAudioTime } from '../utils'
import { playAudio, setPlaylist } from '../actions'

class AudioPlayer extends Component {

    constructor() {
        super()
        this.state = {
            playContent: {
                streamURL: '',
                coverArt: '',
                trackName: '',
                artistName: '',
                duration: '',
                currentTime: 0
            },
        }
    }

    componentDidMount() {
        console.log('Mounted Audio Player')
        this.fetchTracks()
        console.log(this.props)
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
    }

    fetchTracks = () => {
        axios.get(`https://api.soundcloud.com/tracks?linked_partitioning=1&limit=50&offset=0&client_id=a281614d7f34dc30b665dfcaa3ed7505&q=illenium`)
            .then((response) => {

                let randomTrack = response.data.collection[Math.floor(Math.random() * response.data.collection.length)]

                this.setState({
                    playContent: {
                        streamURL: randomTrack.stream_url + `?client_id=a281614d7f34dc30b665dfcaa3ed7505`,
                        coverArt: randomTrack.artwork_url.replace('large.jpg', 't300x300.jpg'),
                        trackName: randomTrack.title,
                        artistName: randomTrack.user.username,
                        trackId: randomTrack.id,
                        duration: (randomTrack.duration / 1000)
                    }
                }, () => {
                    this.props.setPlaylist(response.data.collection)
                })
            })
    }

    randomizeTrack = (track = {}) => {
        let randomTrack = this.state.trackList[Math.floor(Math.random() * this.state.trackList.length)]
        console.log(randomTrack)
    }

    render() {
        const { playContent } = this.state
        const { isAudioPlaying } = this.props
        // console.log(this.state)
        return (
            <>
                <div className="audio-player-container">
                    <div className="audio-player-info">
                        <div className="audio-player-info-container">
                            <img src={playContent.coverArt} />
                            <div>
                                <span>{playContent.trackName}</span>
                                <span>{playContent.artistName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="audio-player-controls">
                        <div className="audio-player-seek">
                            <button>Previous</button>
                            <button
                                onClick={e => {
                                    isAudioPlaying ?
                                        this._audio.pause() :
                                        this._audio.play()
                                }}
                            >
                                {isAudioPlaying ?
                                    'Pause' : 'Play'}
                            </button>
                            <button>Next</button>
                        </div>
                        <div className="audio-player-timeline">
                            <span>{formatAudioTime(playContent.currentTime)}</span>
                            {/* <div className="timeline-behind">
                                <span
                                    className="timeline-forward"
                                    style={{ width: `${(playContent.currentTime / playContent.duration) * 100}%` }}
                                ></span>
                            </div> */}
                            <input
                                type="range"
                                min="0"
                                max={playContent.duration}
                                value={playContent.currentTime}
                                step="0.1"
                                onChange={e => this._audio.currentTime = e.target.value}
                            />
                            <span>{formatAudioTime(playContent.duration)}</span>
                        </div>
                    </div>
                    <div className="audio-player-side">
                        XYZ
                    </div>
                </div>
                <audio
                    controls
                    src={this.state.playContent.streamURL}
                    className="audio-tag"
                    onPlay={(e) => {
                        !isAudioPlaying && this.props.playAudio(playContent.trackId)
                    }}
                    onPause={e => {
                        isAudioPlaying && this.props.playAudio(playContent.trackId)
                    }}
                    onEnded={() => this.randomizeTrack()}
                    onLoadedMetadata={e => {
                        // console.log(e, e.duration)
                    }}
                    ref={(a) => this._audio = a}
                    onTimeUpdate={e => {
                        this.setState({
                            playContent: {
                                ...playContent,
                                // duration: e.target.duration,
                                currentTime: e.target.currentTime,
                            }
                        })
                    }}
                    onEnded={e => {
                        console.log('track ended')
                    }}
                >
                </audio>
            </>
        );
    }
}

const mapStateToProps = function (state) {
    return state.player
}

AudioPlayer = (connect(mapStateToProps, { playAudio, setPlaylist })(AudioPlayer))

export { AudioPlayer };