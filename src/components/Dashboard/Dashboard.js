import React from "react";

import "firebase/firestore";
import firebase from "firebase/app";

import Leftbar from "./Leftbar";
import Panel from "./Panel";

const db = firebase.firestore();

class Dashboard extends React.Component {
  render() {
    let user = firebase.auth().currentUser.displayName;

    return (
      <div className="Dashboard">
        <Leftbar />
        <Panel />
      </div>
    );
  }
}

export default Dashboard;
