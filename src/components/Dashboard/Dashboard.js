import React from "react";

import "firebase/firestore";
import firebase from "firebase/app";

import Leftbar from "./Leftbar";
import Panel from "./Panel";
import Rightbar from "./Rightbar";
const db = firebase.firestore();

class Dashboard extends React.Component {
  render() {
    let user = firebase.auth().currentUser.displayName;

    return (
      <div className="Dashboard">
        <Leftbar />
        <Panel />
        <Rightbar/>
      </div>
    );
  }
}

export default Dashboard;
