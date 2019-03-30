import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Sidebar, AudioPlayer } from './components'
import { Home, Callback, User, Stream } from './pages'
import './scss/styles.scss'
import appBase from './secret'
let SC = window.SC

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('sc_accessToken') === null ?
          <Redirect
            to="/login"
          />
          :
          <Component
            {...props}
          />
      }
    />
  )
}

class App extends Component {
  componentDidMount() {
    SC.initialize({
      client_id: appBase.clientId,
      redirect_uri: appBase.redirect_uri
    });
  }

  render() {
    return (
      <>
        <Sidebar />
        <Switch>
          <Route exact path="/callback" component={Callback} />
          <div className="app-home">
            <div className="app-home-container">
              <div style={{ background: `url(${require('./static/imgs/img_1.jpeg')})` }} className="app-home-overlay" />
              <Route exact path="/" component={Home} />
              <Route exact path="/stream" component={Stream} />
              <Route exact path="/user/:permalink/:section?" component={User} />
            </div>
          </div>
        </Switch>
        <AudioPlayer />
      </>
    );
  }
}

export default App;
