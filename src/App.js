import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Sidebar, AudioPlayer } from './components'
import { Home, Callback } from './pages'
import './scss/styles.scss'

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
      client_id: 'AKm0rmaY0ScS4y0FyUdvWMyfmtMdUYh6',
      redirect_uri: 'http://localhost:3000/callback'
    });
  }

  render() {
    return (
      <>
        <Sidebar />
        <Switch>
          <Route exact path="/callback" component={Callback} />
          <div className="app-home">
            <Route exact path="/" component={Home} />
          </div>
        </Switch>
        <AudioPlayer />
      </>
    );
  }
}

export default App;
