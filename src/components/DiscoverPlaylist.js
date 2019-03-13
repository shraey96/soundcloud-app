import React, { Component } from 'react'
import Slider from 'react-slick'
import {
    MdSkipNext,
    MdSkipPrevious
} from 'react-icons/md'


class DiscoverPlaylist extends Component {


    scrollContainer = (type = "right") => {
        // this.discoverContainerRef.scrollLeft = 500
        // const containerScrollOffset = this.discoverContainerRef.scrollLeft === 0 ? 500 : this.discoverContainerRef.scrollLeft
        // console.log(containerScrollOffset, type)
        // if (type === "right") {
        //     console.log(containerScrollOffset, type)
        //     this.discoverContainerRef.scrollLeft = containerScrollOffset + (140 * 5)
        // } else if (type === "left") {
        //     console.log(containerScrollOffset, type)
        //     this.discoverContainerRef.scrollLeft = containerScrollOffset - (140 * 5)
        // }
        document.querySelector('.discover-container').scrollLeft = 500
    }

    render() {
        const { playlists } = this.props.playlistItem
        return (
            <div className="discover-container-parent">
                {/* <MdSkipPrevious
                    onClick={e => {
                        this.scrollContainer('left')
                    }}
                    className="icon-scroll left"
                /> */}
                <div className="discover-container"
                    ref={a => this.discoverContainerRef = a}
                >
                    {
                        playlists.map((item) => {
                            return (
                                <div className="discover-container--individual"
                                    key={item.id}
                                >
                                    <img src={(item.artwork_url && item.artwork_url.replace('large.jpg', 't300x300.jpg')) || require('../static/artwork_alt.png')} />
                                    <span className="discover-container--individual--title">{item.title}</span>
                                    <span className="discover-container--individual--user">
                                        {item.user.username}
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                {/* <MdSkipNext
                    onClick={e => {
                        this.scrollContainer('right')
                    }}
                    className="icon-scroll right"
                /> */}
            </div>
        )
    }

}

export { DiscoverPlaylist }