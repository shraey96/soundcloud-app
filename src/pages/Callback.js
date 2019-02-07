import React from 'react'

const Callback = () => {
    let acccessToken = window.location.hash.substr(1).split('&')[0].replace('access_token=', '')
    localStorage.setItem('sc_accessToken', acccessToken)
    window.setTimeout(window.opener.SC.connectCallback, 1);
    return (
        <div />
    )
}

export { Callback };
