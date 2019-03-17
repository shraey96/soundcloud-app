import React from 'react'
import axios from 'axios'
import appBase from '../secret';

const ViewHOC = Component => {

    class Wrapper extends React.Component {
        constructor() {
            super()
            this.containerRef = document.querySelector('.app-home-container')
            this.headerRef = document.querySelector('.user-container--bottom--content--nav')
            this.dataURL = ''
            this.nextDataHREF = ''
            this.state = {
                data: [],
                firstLoad: true,
                lazyLoadPossible: true,
                showSubHeader: false
            }
        }

        componentDidMount = () => {
            this.containerRef.addEventListener('scroll', this.handleScroll, false)
        }

        componentWillUnmount() {
            this.containerRef.removeEventListener('scroll', this.handleScroll, false)
        }

        handleScroll = () => {
            let offsetHeight = this.containerRef.offsetHeight
            let scrollTop = this.containerRef.scrollTop
            let scrollHeight = this.containerRef.scrollHeight
            // if (scrollTop >= 358 && !this.state.showSubHeader) {
            //     this.headerRef.style.position = 'fixed'
            //     this.headerRef.style.top = 0
            //     this.setState({
            //         showSubHeader: true
            //     })
            // }
            // if (scrollTop < 358 && this.state.showSubHeader) {
            //     this.headerRef.style.position = 'unset'
            //     this.headerRef.style.top = 'unset'
            //     this.setState({
            //         showSubHeader: false
            //     })
            // }
            if ((scrollTop / (scrollHeight - offsetHeight)) * 100 > 75) {
                if (!this.state.loading && this.state.lazyLoadPossible && this.nextDataHREF !== null) {
                    this.loadData()
                }
            }
        }

        initView(url) {
            this.dataURL = url
            this.loadData()
        }

        loadData = () => {
            this.setState({
                firstLoad: this.nextDataHREF === '',
                loading: true
            })
            axios.get(appBase.proxyURL + (this.nextDataHREF === '' ? this.dataURL : this.nextDataHREF))
                .then(response => {
                    this.nextDataHREF = response.data.next_href
                    const responseData = [...response.data.collection].filter(item => !item.playlist)
                    // const filter2 = [...response.data.collection].filter(item => !item.track)
                    this.setState({
                        firstLoad: false,
                        loading: false,
                        data: this.state.firstLoad ? responseData : [...this.state.data, ...responseData],
                        lazyLoadPossible: response.data.nextDataHREF !== null
                    })
                })
        }


        render() {
            const {
                data,
                firstLoad,
                loading
            } = this.state
            return (
                <>
                    <Component
                        {...this.props}
                        data={data}
                        initView={(url, callback) => this.initView(url, callback)}
                        firstLoad={firstLoad}
                    />
                    {
                        loading &&
                        <div className="loader">
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                    }
                </>
            )
        }
    }

    return Wrapper
}

export default ViewHOC