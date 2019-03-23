import axios from 'axios'
import _ from 'lodash'
import appBase from './secret';

const pow = Math.pow
const floor = Math.floor
const abs = Math.abs
const log = Math.log

let likedTracks = []
let followers = []
let following = []
let playHistory = []
let playList = []

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
            likedTracks = _.flattenDeep(likedTracks).map(t => {
                t.track.liked_date = t.created_at
                return t
            })
            return (likedTracks).reduce((a, b) => {
                return a[b.track.id] = b.track, a;
            }, {})
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

const getPlaylist = (playlistId, getFullInfo = false) => {
    let trackList = []
    return axios({
        method: 'get',
        url: proxyURL + `https://api.soundcloud.com/playlists/${playlistId}?client_id=${appBase.clientId}`,
        config: { headers: { 'Content-Type': 'application/json' } }
    }).then((playlistTracks) => {
        if (playlistTracks.data.tracks.length > 0) {
            trackList = [...playlistTracks.data.tracks].map((t) => {
                return {
                    track_id: t.id,
                    track: t
                }
            })
            updatePlayhistory({
                "context_urn": `soundcloud:playlists:${playlistId}`,
                "track_urn": `soundcloud:tracks:${trackList[0].track_id}`
            })
            if (!getFullInfo) {
                return trackList
            } else {
                return { ...playlistTracks.data, trackList }
            }
        }
    }).catch((err) => {
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

const round = (n, precision) => {
    var prec = Math.pow(10, precision);
    return Math.round(n * prec) / prec;
}

const formatNumber = (n) => {
    var base = floor(log(abs(n)) / log(1000));
    var suffix = 'KMB'[base - 1];
    return suffix ? round(n / pow(1000, base), 2) + suffix : '' + n;
}

export {
    formatAudioTime,
    formatNumber,
    getUserLikedTracks,
    getUserFollowers,
    getUserFollowings,
    getUserPlayHistory,
    getUserInfo,
    getUserPlaylist,
    updatePlayhistory,
    getPlaylist
}