import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'



class Me extends Component {
    render() {
        return (
            <div>
                xxyz
            </div>
        )
    }
}

Me = withRouter(Me)

export { Me }

// <Switch>
//                 <Route exact path="/manage/teams">
//                     <TeamsListing />
//                 </Route>
//                 <Route>
//                     <ErrorScreen />
//                 </Route>
//             </Switch>