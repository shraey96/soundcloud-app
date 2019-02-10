import React, { Component } from 'react'
import {
    SortableContainer,
    SortableElement,
} from 'react-sortable-hoc'
import { MdClose, MdPlayArrow, MdPause } from 'react-icons/md'
import deepEqual from 'deep-equal'

const SortableItem = SortableElement(({ item, trackId, onRemoveClick, onPlayClick, index, isAudioPlaying }) => {
    return (
        <div
            className="sortable-playlist-tracks"
            onClick={e => {
                onPlayClick &&
                    onPlayClick(item, index)
            }}
        >
            <img src={item.track.artwork_url} />
            <span className={item.track.title.length >= 35 && 'hover-marquee'}>
                {item.track.title}
            </span>
            <MdClose
                className="sortable-player-remove"
                onClick={e => {
                    e.stopPropagation()
                    onRemoveClick && onRemoveClick(item)
                }}
            />
            {
                (item.track_id === trackId && isAudioPlaying) ?
                    <MdPause className="player-icon" /> :
                    <MdPlayArrow className="player-icon" />
            }
        </div>
    )
})

class SortablePlayer extends Component {

    componentDidMount() {
        window.addEventListener('mouseup', this.handleClickOutside, false)
        // window.addEventListener('keyup', this.handleClickOutside)
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.handleClickOutside, false)
        // window.removeEventListener('keyup', this.handleClickOutside)
    }

    // handleClickOutside = (e) => {
    //     if (this.props.isOpen && this._sortPlayer.classList.contains('open')) {
    //         this.props.handleClose()
    //     }
    // }


    shouldComponentUpdate(nextProps, nextState) {
        if (!deepEqual(nextProps.items, this.props.items)) {
            return true
        }
        if ((nextProps.trackId !== this.props.trackId) || (nextProps.isAudioPlaying !== this.props.isAudioPlaying)) {
            return true
        }
        if (nextProps.className !== this.props.className) {
            return true
        }
        return false;
    }

    render() {
        const { className = '', items, trackId, isAudioPlaying, onRemoveClick, onPlayClick } = this.props
        return (
            <div
                className={className}
                ref={player => this._sortPlayer = player}
            >
                {items.map((item, index) => (
                    <SortableItem
                        key={`item-${index}`}
                        index={index}
                        item={item}
                        onPlayClick={(track, index) => onPlayClick && onPlayClick(track, index)}
                        onRemoveClick={track => onRemoveClick && onRemoveClick(track)}
                        trackId={trackId}
                        isAudioPlaying={isAudioPlaying}
                    />
                ))}
            </div>
        )
    }

}

SortablePlayer = SortableContainer(SortablePlayer)

export { SortablePlayer }