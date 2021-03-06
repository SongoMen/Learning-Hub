import React, { Component } from "react";
import {
  Route,
  BrowserRouter as Router,
  Redirect,
  Switch
} from "react-router-dom";
import { firebaseAuth } from "./auth";

import Loader from "./elements/Loader";
import LandingPage from "./LandingPage/LandingPage";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";
import CourseContainer from "./CoursePage/CourseContainer";
import Page404 from "./404page/404";
import ErrorBoundary from "../ErrorBoundary";

export function PrivateRoute({ component: Component, authed, ...rest }) {
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

export function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
          <Redirect to="/dashboard" />
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
      <Loader />
    ) : (
        <Router>
            <ErrorBoundary>
          <div className="container">
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <PublicRoute
                authed={this.state.authed}
                path="/login"
                component={Login}
              />
              <PublicRoute
                authed={this.state.authed}
                path="/register"
                component={Register}
              />
              <PrivateRoute
                authed={this.state.authed}
                path="/dashboard"
                component={Dashboard}
              />
              <PrivateRoute
                authed={this.state.authed}
                path="/courses"
                component={Dashboard}
              />
              <PrivateRoute
                authed={this.state.authed}
                path="/devpanel"
                component={Dashboard}
              />
              <PrivateRoute
                authed={this.state.authed}
                path="/course/:name"
                component={CourseContainer}
                exact
                name={window.location.pathname.split("/")[2]}
              />
              <PrivateRoute
                authed={this.state.authed}
                path="/course/:name/:id"
                exact
                component={CourseContainer}
                id={window.location.pathname.split("/")[3]}
              />
              <Route component={Page404} />
            </Switch>
          </div>

      </ErrorBoundary>
        </Router>
    );
  }
}

export default App;
