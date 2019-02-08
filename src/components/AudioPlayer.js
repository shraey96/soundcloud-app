import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'
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
            trackIndex: 0
        }
        this.proxyURL = `https://cors-anywhere.herokuapp.com/`
    }

    componentDidMount() {
        console.log('Mounted Audio Player')
        // this.fetchTracks()
        window.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        window.remove("keydown", this.handleKeyDown)
    }

    componentWillReceiveProps(nextProps) {
        if (!deepEqual(nextProps.playlist, this.props.playlist)) {
            const trackOne = nextProps.playlist[0].track
            this.setState({
                trackIndex: 0
            }, () => {
                this.setPlayContent(trackOne)
            })
        }
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 32) {
            this.setState({
                isAudioPlaying: !this.state.isAudioPlaying
            }, () => {
                this.state.isAudioPlaying ? this._audio.pause() : this._audio.play()
            })
        }
        if (e.ctrlKey) {
            e.keyCode === 39 && this.seekTrack('next')
            e.keyCode === 37 && this.seekTrack('prev')
        }
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

    seekTrack = (type) => {
        const { trackIndex } = this.state
        if (type === 'next') {
            if (trackIndex >= 0) {
                this.setState({
                    trackIndex: this.state.trackIndex + 1,
                }, () => {
                    this.setPlayContent(this.props.playlist[this.state.trackIndex].track)
                })
            }
        } else {
            if (trackIndex !== 0 && trackIndex < (this.props.playlist.length - trackIndex)) {
                console.log(999)
                this.setState({
                    trackIndex: this.state.trackIndex - 1
                }, () => {
                    this.setPlayContent(this.props.playlist[this.state.trackIndex].track)
                })
            }
        }
    }

    setPlayContent = async (track) => {
        let streamURL = track.stream_url ? track.streamURL + `?client_id=a281614d7f34dc30b665dfcaa3ed7505` : ''
        if (!streamURL) {
            let streamURLProg = track.media.transcodings.find(x => x.format.protocol === "progressive").url
            let { data } = await axios.get(this.proxyURL + streamURLProg)
            streamURL = data.url
        }
        this.setState({
            playContent: {
                streamURL: streamURL,
                coverArt: track.artwork_url.replace('large.jpg', 't300x300.jpg'),
                trackName: track.title,
                artistName: track.user.username,
                trackId: track.id,
                duration: (track.duration / 1000)
            },
        }, () => {
            this._audio.play()
        })
    }

    render() {
        const { playContent, trackIndex } = this.state
        const { isAudioPlaying } = this.props

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
                            <button
                                onClick={e => {
                                    this.seekTrack('prev')
                                }}
                                disabled={trackIndex === 0}
                            >
                                Previous
                            </button>
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
                            <button
                                onClick={e => {
                                    this.seekTrack('next')
                                }}
                            >
                                Next
                            </button>
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
                        <span>
                            x
                        </span>
                        <span>
                            y
                        </span>
                    </div>
                </div>
                <audio preload="metadata"
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
                        this.seekTrack('next')
                    }}
                    type="audio/mpeg"
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