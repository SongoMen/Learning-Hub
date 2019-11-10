import React from "react";
import { withRouter, NavLink } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";

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
        <div className="Leftbar__logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="logo"
            viewBox="0 0 24 24"
          >
            <path d="M16.5 9.4L7.5 4.21"></path>
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
            <path d="M3.27 6.96L12 12.01 20.73 6.96"></path>
            <path d="M12 22.08L12 12"></path>
          </svg>
          <h3>Learning Hub</h3>
        </div>
        <ul>
          <li>
            <NavLink activeClassName="active" to="/dashboard" aria-label="Main dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <path d="M3 9L21 9" />
                <path d="M9 21L9 9" />
              </svg>
              <h4>Dashboard</h4>
            </NavLink>
          </li>
          <li>
            <NavLink to="/courses" aria-label="All courses">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
              <h4>Courses</h4>
            </NavLink>
          </li>
          {admin && this.state.loaded && (
            <li className="Leftbar__dev">
              <NavLink to="/devpanel" aria-label="Dev panel">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 17L10 11 4 5" />
                  <path d="M12 19L20 19" />
                </svg>
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
