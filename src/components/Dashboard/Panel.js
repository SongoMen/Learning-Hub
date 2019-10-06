import React from "react";
import date from "date-and-time";
import "firebase/firestore";
import firebase from "firebase/app";

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");

class Panel extends React.Component {
  render() {
    let user = firebase.auth().currentUser.displayName;
    
    return (
      <div className="Panel">
        <div className="Panel__title">
          <h3>Dashboard</h3>
          <div className="Panel__time">
            <h3 className="Panel__date">{formatDate}</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="Panel__search"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21L16.65 16.65" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
}
export default Panel;
