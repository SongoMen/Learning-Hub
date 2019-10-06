import React from "react";
import { logout } from "../auth";

import "firebase/firestore";
import firebase from "firebase/app";

const db = firebase.firestore();

class Dashboard extends React.Component{
    render(){
        let user = firebase.auth().currentUser.displayName;

        return(
            <h1 onClick={()=>logout()}>LOGOUT</h1>
        );
    }
}

export default Dashboard;