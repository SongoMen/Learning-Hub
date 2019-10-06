import React from "react";
import { logout } from "../auth";
import date from 'date-and-time';
import "firebase/firestore";
import firebase from "firebase/app";

const now = new Date();
const formatDate = date.format(now, 'DD MMM YYYY, dddd'); 

class Panel extends React.Component {
  render() {
    let user = firebase.auth().currentUser.displayName;

    return (
      <div className="Panel">
        <div className="Panel__title">
          <h3>Dashboard</h3>
          <h3 className="Panel__date">{formatDate}</h3>
        </div>
        <h1 onClick={() => logout()}>LOGOUT</h1>

      </div>
    );
  }
}
export default Panel;
