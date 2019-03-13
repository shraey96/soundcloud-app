import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import deepEqual from 'deep-equal'
import { arrayMove } from 'react-sortable-hoc'
import { SortablePlayer } from './SortablePlayer'

import {
    MdPlayArrow, MdPause, MdSkipNext,
    MdSkipPrevious, MdVolumeDown, MdVolumeUp,
    MdQueueMusic, MdShuffle, MdRepeat, MdRepeatOne,
    MdFavorite
} from 'react-icons/md'

import { formatAudioTime, updatePlayhistory } from '../utils'

import {
    playAudio, setPlaylist, reOrderPlaylist,
    toggleReorderPlaylist, toggleTrackLike
} from '../actions'

import appBase from '../secret'

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
            repeatMode: 0,
            isPlayListMenuOpen: false
        }
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        window.remove("keydown", this.handleKeyDown)
    }

    componentWillReceiveProps(nextProps) {
        if (!deepEqual(nextProps.player.playlist, this.props.player.playlist) && !nextProps.player.playListReOrder) {
            this.setState({
                trackIndex: 0
            }, () => {
                this.setPlayContent(nextProps.player.playlist[0].track)
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

    onSortEnd = ({ oldIndex, newIndex }) => {
        const reOrderList = arrayMove([...this.props.player.playlist], oldIndex, newIndex)
        if (!deepEqual(reOrderList, this.props.player.playlist)) {
            this.props.reOrderPlaylist(arrayMove([...this.props.player.playlist], oldIndex, newIndex))
        }
    }

    seekTrack = (type) => {
        const { trackIndex, repeatMode } = this.state
        const { playlist } = this.props.player
        console.log(type)
        if (type === 'next') {
            if (trackIndex >= 0) {
                console.log(trackIndex)
                if (repeatMode === 2) {
                    this.setPlayContent(playlist[this.state.trackIndex].track)
                } else if (repeatMode === 1 && trackIndex === (playlist.length - 1)) {
                    this.setState({
                        trackIndex: 0
                    }, () => {
                        this.setPlayContent(playlist[0].track)
                    })
                } else {
                    console.log(999)
                    this.setState({
                        trackIndex: this.state.trackIndex + 1,
                    }, () => {
                        this.setPlayContent(playlist[this.state.trackIndex].track)
                    })
                }
            }
        } else {
            if (trackIndex !== 0 && trackIndex < (playlist.length - trackIndex)) {
                this.setState({
                    trackIndex: this.state.trackIndex - 1
                }, () => {
                    this.setPlayContent(playlist[this.state.trackIndex].track)
                })
            }
        }
    }

    setPlayContent = async (track) => {
        let streamURL = track.stream_url ? track.stream_url + `?client_id=${appBase.clientId}` : ''
        if (streamURL === '') {
            let streamURLProg = track.media.transcodings.find(x => x.format.protocol === "progressive").url
            let { data } = await axios.get(appBase.proxyURL + streamURLProg)
            streamURL = data.url
        }
        this.setState({
            playContent: {
                ...track,
                streamURL: streamURL,
                coverArt: track.artwork_url ? track.artwork_url.replace('large.jpg', 't300x300.jpg') : require('../static/artwork_alt.png'),
                trackName: track.title,
                artistName: track.user.username,
                trackId: track.id,
                duration: (track.duration / 1000),
            },
        }, () => {
            this._audio.play()
            updatePlayhistory({
                "track_urn": `soundcloud:tracks:${track.id}`
            })
        })
    }

    handleTrackRemove = (track) => {
        const playlist = [...this.props.player.playlist].filter(t => t.track_id !== track.track_id)
        this.props.reOrderPlaylist(playlist)
    }

    render() {
        const { playContent, trackIndex, isShuffleActive, isPlayListMenuOpen, repeatMode } = this.state
        const { isAudioPlaying } = this.props.player
        const { userLikes, loading } = this.props.user

        return (
            <>
                <div className={`audio-player-container ${loading && 'hidden'}`}>
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
                        <MdFavorite
                            className={`player-icon inactive med ${userLikes[playContent.trackId] && 'liked'}`}
                            onClick={() => {
                                if (userLikes[playContent.trackId]) {
                                    this.props.toggleTrackLike(playContent, false)
                                } else {
                                    this.props.toggleTrackLike(playContent, true)
                                }
                            }}
                        />
                        {
                            (repeatMode === 0 || repeatMode === 1) ?
                                <MdRepeat
                                    className={`player-icon med ${repeatMode === 0 && 'inactive'}`}
                                    onClick={() => {
                                        this.setState({
                                            repeatMode: repeatMode === 0 ? 1 : repeatMode === 1 ? 2 : 0
                                        })
                                    }}
                                /> :
                                <MdRepeatOne
                                    className={`player-icon med ${repeatMode !== 2 && 'inactive'}`}
                                    onClick={() => {
                                        this.setState({
                                            repeatMode: 0
                                        })
                                    }}
                                />
                        }
                        <MdShuffle
                            className={`player-icon med ${!isShuffleActive && 'inactive'}`}
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
                            <MdQueueMusic className="player-icon playlist"
                                onClick={e => this.setState({ isPlayListMenuOpen: !isPlayListMenuOpen })} />
                            {
                                this.props.player.playlist.length > 0 &&
                                <SortablePlayer
                                    items={this.props.player.playlist}
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
                    onLoadedMetadata={e => {
                        // console.log(e, e.duration)
                    }}
                    ref={a => this._audio = a}
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

const mapStateToProps = function ({ player, user }) {
    return { player, user }
}

AudioPlayer = (connect(mapStateToProps,
    { playAudio, setPlaylist, reOrderPlaylist, toggleReorderPlaylist, toggleTrackLike }
)(AudioPlayer))

export { AudioPlayer };