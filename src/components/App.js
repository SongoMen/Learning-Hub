import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Redirect,
  Switch
} from "react-router-dom";
import { firebaseAuth } from "./auth";

import LandingPage from "./landingPage/LandingPage"

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/Dashboard" />
        )
      }
    />
  );
}

class App extends Component {
  _isMounted = false;
  state = {
    authed: false,
    loading: true,
    theme: ""
  };
  componentDidMount() {
    this._isMounted = true;
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (this._isMounted) {
        if (user) {
          this.setState({
            authed: true,
            loading: false
          });
        } else {
          this.setState({
            authed: false,
            loading: false
          });
        }
      }
    });
  }
  componentWillUnmount() {
    this._isMounted = false;
    this.removeListener();
  }

  render() {
    return this.state.loading ? (
      <div className="loader-background">
        <ul className="loader">
          <li />
          <li />
          <li />
        </ul>
      </div>
    ) : (
      <Router>
        <div className="container">
          <Switch>
            <Route exact path="/" component={LandingPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
