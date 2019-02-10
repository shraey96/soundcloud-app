import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'
import { arrayMove } from 'react-sortable-hoc'
import { SortablePlayer } from './SortablePlayer'

import {
    MdPlayArrow, MdPause, MdSkipNext,
    MdSkipPrevious, MdVolumeDown, MdVolumeUp,
    MdPlaylistPlay, MdShuffle
} from 'react-icons/md'

import { formatAudioTime } from '../utils'
import { playAudio, setPlaylist, reOrderPlaylist, toggleReorderPlaylist } from '../actions'


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
            trackIndex: 0,
            isShuffleActive: false,
            isPlayListMenuOpen: false
        }
        this.proxyURL = `https://cryptic-ravine-67258.herokuapp.com/`
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        window.remove("keydown", this.handleKeyDown)
    }

    componentWillReceiveProps(nextProps) {
        if (!deepEqual(nextProps.playlist, this.props.playlist) && !nextProps.playListReOrder) {
            this.setState({
                trackIndex: 0
            }, () => {
                this.setPlayContent(nextProps.playlist[0].track)
            })
        }
    }

    componentDidUpdate() {
        // if (document.querySelector('.marquee')) {
        //     let x = document.querySelector('.marquee').children[0].getBoundingClientRect().left
        //     console.log(x)
        // }
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        const reOrderList = arrayMove([...this.props.playlist], oldIndex, newIndex)
        if (!deepEqual(reOrderList, this.props.playlist)) {
            this.props.reOrderPlaylist(arrayMove([...this.props.playlist], oldIndex, newIndex))
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
                this.setState({
                    trackIndex: this.state.trackIndex - 1
                }, () => {
                    this.setPlayContent(this.props.playlist[this.state.trackIndex].track)
                })
            }
        }
    }

    setPlayContent = async (track) => {
        let streamURL = track.stream_url ? track.stream_url + `?client_id=a281614d7f34dc30b665dfcaa3ed7505` : ''
        if (streamURL === '') {
            let streamURLProg = track.media.transcodings.find(x => x.format.protocol === "progressive").url
            let { data } = await axios.get(this.proxyURL + streamURLProg)
            streamURL = data.url
        }
        this.setState({
            playContent: {
                streamURL: streamURL,
                coverArt: track.artwork_url ? track.artwork_url.replace('large.jpg', 't300x300.jpg') : require('../static/artwork_alt.png'),
                trackName: track.title,
                artistName: track.user.username,
                trackId: track.id,
                duration: (track.duration / 1000)
            },
        }, () => {
            this._audio.play()
        })
    }

    handleTrackRemove = (track) => {
        const playlist = [...this.props.playlist].filter(t => t.track_id !== track.track_id)
        this.props.reOrderPlaylist(playlist)
    }

    render() {
        const { playContent, trackIndex, isShuffleActive, isPlayListMenuOpen } = this.state
        const { isAudioPlaying } = this.props

        return (
            <>
                <div className="audio-player-container">
                    <div className="audio-player-info-container">
                        <img src={playContent.coverArt} />
                        <div>
                            <span className={playContent.trackName.length > 27 && 'marquee'}>
                                <span>{playContent.trackName}</span>
                            </span>
                            <span>{playContent.artistName}</span>
                        </div>
                    </div>
                    <div className="audio-player-controls">
                        <div className="audio-player-seek">
                            <MdSkipPrevious
                                onClick={e => {
                                    this.seekTrack('prev')
                                }}
                                disabled={trackIndex === 0}
                                className="player-icon"
                            />
                            <div
                                className="audio-play-pause"
                                onClick={e => {
                                    isAudioPlaying ?
                                        this._audio.pause() :
                                        this._audio.play()
                                }}
                            >
                                <span className={isAudioPlaying ? 'animate-pause' : 'animate-play'}>
                                    <MdPlayArrow className="player-icon play-icon" />
                                    <MdPause className="player-icon pause-icon" />
                                </span>
                            </div>
                            <MdSkipNext
                                onClick={e => {
                                    this.seekTrack('next')
                                }}
                                className="player-icon"
                            />
                        </div>
                        <div className="audio-player-timeline">
                            <span>{formatAudioTime(playContent.currentTime)}</span>
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
                        <MdShuffle
                            className={`player-icon shuffle ${!isShuffleActive && 'inactive'}`}
                            onClick={e => {
                                this.setState({ isShuffleActive: !isShuffleActive })
                            }}
                        />
                        <div className="volume-container">
                            {
                                this._audio && (
                                    this._audio.volume < 0.5 ?
                                        <MdVolumeDown className="player-icon" />
                                        :
                                        <MdVolumeUp className="player-icon" />
                                )
                            }
                            <input
                                className="volume-slider"
                                type="range"
                                min="0"
                                max="1"
                                value={this._audio ? this._audio.volume : 0}
                                step="0.05"
                                onChange={e => this._audio.volume = e.target.value}
                            />
                        </div>
                        <div className="playlist-container">
                            <MdPlaylistPlay className="player-icon playlist"
                                onClick={e => this.setState({ isPlayListMenuOpen: !isPlayListMenuOpen })} />
                            {
                                this.props.playlist.length > 0 &&
                                <SortablePlayer
                                    items={this.props.playlist}
                                    onSortEnd={this.onSortEnd}
                                    className={`playlist-menu ${isPlayListMenuOpen && 'open'}`}
                                    onPlayClick={(sTrack, index) => {
                                        if (sTrack.track_id === playContent.trackId) {
                                            if (isAudioPlaying) {
                                                this._audio.pause()
                                            } else {
                                                this._audio.play()
                                            }
                                            this.props.playAudio(sTrack.trackId)
                                        } else {
                                            this.setState({ trackIndex: index },
                                                () => this.setPlayContent(sTrack.track))
                                        }
                                    }
                                    }
                                    onRemoveClick={sTrack => this.handleTrackRemove(sTrack)}
                                    distance={5}
                                    trackId={playContent.trackId}
                                    helperClass="sortable-helper"
                                    isOpen={isPlayListMenuOpen}
                                    isAudioPlaying={isAudioPlaying}
                                    handleClose={() => this.setState({ isPlayListMenuOpen: false })}
                                />
                            }
                        </div>
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

AudioPlayer = (connect(mapStateToProps, { playAudio, setPlaylist, reOrderPlaylist, toggleReorderPlaylist })(AudioPlayer))

export { AudioPlayer };