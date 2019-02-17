import axios from 'axios'
import _ from 'lodash'
import appBase from './secret';

const likedTracks = []
const followers = []
const following = []
const playHistory = []
const playList = []

const proxyURL = appBase.proxyURL

const getUserInfo = () => {
    return axios.get(proxyURL + `https://api.soundcloud.com/me`)
        .then((response) => {
            return response.data
        })
}

const getUserLikedTracks = (url, id) => {
    if (!url) {
        url = `https://api-v2.soundcloud.com/users/${id}/track_likes?limit=200&linked_partitioning=1`
    }
    return axios.get(proxyURL + url).then((response) => {
        if (response.data.next_href) {
            likedTracks.push([...response.data.collection])
            return getUserLikedTracks(response.data.next_href)
        } else {
            likedTracks.push([response.data.collection])
            return _.flattenDeep(likedTracks).reduce((a, b) => {
                return a[b.track.id] = b.track, a;
            }, {});
        }
    }).catch(err => {
        console.log(err)
    })
}

const getUserPlaylist = (url, id) => {
    if (!url) {
        url = `https://api-v2.soundcloud.com/users/${id}/playlists/liked_and_owned?client_id=${appBase.clientId}&limit=200&offset=0`
    }
    return axios.get(proxyURL + url).then((response) => {
        if (response.data.next_href) {
            playList.push([...response.data.collection])
            return getUserPlaylist(response.data.next_href)
        } else {
            playList.push([response.data.collection])
            return _.flattenDeep(playList)
        }
    }).catch(err => {
        console.log(err)
    })
}

const getUserFollowers = (url) => {
    if (!url) {
        url = `https://api.soundcloud.com/me/followers?limit=200&offset=0`
    }
    return axios.get(proxyURL + url).then((response) => {
        if (response.data.next_href) {
            followers.push([...response.data.collection])
            return getUserFollowers(response.data.next_href)
        } else {
            followers.push([response.data.collection])
            return _.flattenDeep(followers)
        }
    }).catch(err => {
        console.log(err)
    })
}

const getUserFollowings = (url) => {
    if (!url) {
        url = `https://api.soundcloud.com/me/followings?limit=200&offset=0`
    }
    return axios.get(proxyURL + url).then((response) => {
        if (response.data.next_href) {
            following.push([...response.data.collection])
            return getUserFollowings(response.data.next_href)
        } else {
            following.push([response.data.collection])
            return _.flattenDeep(following)
        }
    }).catch(err => {
        console.log(err)
    })
}

const getUserPlayHistory = (url) => {
    if (!url) {
        url = `https://api-v2.soundcloud.com/me/play-history/tracks?limit=200&linked_partitioning=1`
    }
    return axios.get(proxyURL + url).then((response) => {
        if (response.data.next_href) {
            playHistory.push([...response.data.collection])
            return getUserPlayHistory(response.data.next_href)
        } else {
            playHistory.push([response.data.collection])
            return _.flattenDeep(playHistory)
        }
    }).catch(err => {
        console.log(err)
    })
}

const updatePlayhistory = (trackPayload) => {
    axios({
        method: 'post',
        url: proxyURL + `https://api-v2.soundcloud.com/me/play-history?client_id=${appBase.clientId}`,
        data: trackPayload,
        config: { headers: { 'Content-Type': 'application/json' } }
    }).then((response) => {

    }).catch((err) => {
        console.log(err)
    })
}

const formatAudioTime = (time) => {
    // time = Math.round(time)
    let hrs = ~~(time / 3600);
    let mins = ~~((time % 3600) / 60);
    let secs = ~~time % 60;
    let ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

export {
    formatAudioTime,
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo,
    getUserPlaylist,
    updatePlayhistory
}