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
    toggleReorderPlaylist, toggleTrackLike,
    setTrackIndex
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
            isPlayListMenuOpen: false,
            scalePlayer: false
        }
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown)
    }

    componentDidUpdate(prevProps) {
        if (this.props.player.length <= 0) return

        if (this.props.player.activeTrackIndex !== prevProps.player.activeTrackIndex && !this.props.player.playListReOrder) {
            this.setPlayContent(this.props.player.playlist[this.props.player.activeTrackIndex].track)
        }

        if (this.props.player.isAudioPlaying !== prevProps.player.isAudioPlaying) {
            this.props.player.isAudioPlaying
                ? this._audio.play()
                : this._audio.pause()
        }

        if (JSON.stringify(this.props.player.playlist) !== JSON.stringify(prevProps.player.playlist)
            && !this.props.player.playListReOrder) {
            this.setState({
                scalePlayer: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        scalePlayer: false
                    })
                }, 300)
            })
            this.setPlayContent(this.props.player.playlist[this.props.player.activeTrackIndex || 0].track, true)
        }

    }

    handleKeyDown = (e) => {
        if (e.keyCode === 32) {
            // this.props.player.isAudioPlaying ? this._audio.pause() : this._audio.play()
            this.props.playAudio((this.state.playContent || {}).trackId)
        }
        if (e.ctrlKey) {
            e.keyCode === 39 && this.handleTrackSeek('next')
            e.keyCode === 37 && this.handleTrackSeek('prev')
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
        if (type === 'next') {
            if (trackIndex >= 0) {
                if (repeatMode === 2) {
                    this.setPlayContent(playlist[this.state.trackIndex].track)
                } else if (repeatMode === 1 && trackIndex === (playlist.length - 1)) {
                    this.setState({
                        trackIndex: 0
                    }, () => {
                        this.setPlayContent(playlist[0].track)
                    })
                } else {
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

    setPlayContent = async (track, autoPlay = true) => {
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
            this.props.playAudio(track.id)
            updatePlayhistory({
                "track_urn": `soundcloud:tracks:${track.id}`
            })
        })
    }

    handleTrackRemove = (track) => {
        const playlist = [...this.props.player.playlist].filter(t => t.track_id !== track.track_id)
        this.props.reOrderPlaylist(playlist)
    }

    handleTrackSeek = (type = 'next') => {
        const { setTrackIndex, player } = this.props
        const { activeTrackIndex, playlist } = player
        if ((type === 'next' && !playlist[activeTrackIndex + 1])
            || (type === 'prev' && !playlist[activeTrackIndex - 1]))
            return
        else {
            type === 'next' && setTrackIndex('inc')
            type === 'prev' && setTrackIndex('dec')
        }
    }

    render() {
        const { playContent, isShuffleActive,
            isPlayListMenuOpen, repeatMode,
            scalePlayer } = this.state
        const { isAudioPlaying, activeTrackIndex } = this.props.player
        const { userLikes, loading } = this.props.user

        return (
            <>
                <div className={`audio-player-container ${loading && 'hidden'} ${scalePlayer && 'scale'}`}>
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
                                    this.handleTrackSeek('prev')
                                }}
                                disabled={activeTrackIndex === 0}
                                className="player-icon"
                            />
                            <div
                                className="audio-play-pause"
                                onClick={e => this.props.playAudio((playContent || {}).trackId)}
                            >
                                <span className={isAudioPlaying ? 'animate-pause' : 'animate-play'}>
                                    <MdPlayArrow className="player-icon play-icon" />
                                    <MdPause className="player-icon pause-icon" />
                                </span>
                            </div>
                            <MdSkipNext
                                onClick={e => {
                                    this.handleTrackSeek('next')
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
                    // onPlay={(e) => {
                    //     !isAudioPlaying && this.props.playAudio(playContent.trackId)
                    // }}
                    // onPause={e => {
                    //     isAudioPlaying && this.props.playAudio(playContent.trackId)
                    // }}
                    ref={a => this._audio = a}
                    onTimeUpdate={e => {
                        this.setState({
                            playContent: {
                                ...playContent,
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
    {
        playAudio, setPlaylist, reOrderPlaylist,
        toggleReorderPlaylist, toggleTrackLike, setTrackIndex
    }
)(AudioPlayer))

export { AudioPlayer }