import React, { Component } from 'react'

import appBase from '../../secret'

import { TrackItem } from '../../components'

import ViewHOC from '../../containers/ViewHOC'

class Likes extends Component {
    componentDidMount() {
        const { initView, userId } = this.props
        initView(`https://api-v2.soundcloud.com/users/${userId}/likes?client_id=${appBase.clientId}&limit=40`)
    }
    render() {
        const { data, firstLoad } = this.props
        return (
            <div className="user-container--bottom--content--likes">
                {
                    data.length > 0 && data.map((item, index) => {
                        return (
                            <TrackItem
                                item={item}
                                key={item.track.id}
                            />
                        )
                    })
                }
            </div>
        )
    }
}

export default ViewHOC(Likes)