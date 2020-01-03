import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import { Logo } from "../_helpers";
import { ReactComponent as DashboardIcon } from "../../svgs/dashboardIcon.svg";
import { ReactComponent as CoursesIcon } from "../../svgs/coursesIcon.svg";
import { ReactComponent as DevIcon } from "../../svgs/devIcon.svg";

const db = firebase.firestore();

let admin = false;
class Leftbar extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      loaded: false
    };
  }
  componentDidMount() {
    this._isMounted = true;
    let user = firebase.auth().currentUser.uid;

    db.collection("users")
      .doc(user)
      .onSnapshot(
        function(doc) {
          if (typeof doc.data() !== "undefined") {
            admin = doc.data()["admin"];
            this.setState({
              loaded: true
            });
          }
        }.bind(this)
      );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="Leftbar">
        <Logo class="Leftbar__logo" link="0" />
        <ul>
          <li>
            <NavLink
              activeClassName="active"
              to="/dashboard"
              aria-label="Main dashboard"
            >
              <DashboardIcon />
              <h4>Dashboard</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" aria-label="All courses">
              <CoursesIcon />
              <h4>Courses</h4>
            </NavLink>
          </li>
          {admin && this.state.loaded && (
            <li className="Leftbar__dev">
              <NavLink to="/devpanel" aria-label="Dev panel">
                <DevIcon />
                <h4>Dev Panel</h4>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    );
  }
}
export default withRouter(Leftbar);
