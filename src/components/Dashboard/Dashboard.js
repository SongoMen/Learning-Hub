import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";

import Leftbar from "./Leftbar";
import Panel from "./Panel";
import Rightbar from "./Rightbar";
import PopupAvatar from "../elements/PopupAvatar"

const mapStateToProps = state => ({
  ...state
});

class Dashboard extends React.Component {
  _isMounted = false;

  componentWillUnmount(){
    this._isMounted = false;
  }
  componentDidMount(){
    this._isMounted = true;
  }
  render() {

    if(!this.props.rightBar && document.getElementById("Panel")){
      document.getElementById("Panel").style.width="90%"
    }
    else if(document.getElementById("Panel")){
      document.getElementById("Panel").style.width="68%"
    }
    return (
      <div className="Dashboard">
        {this.props.popupAvatar === true && <PopupAvatar/>}
        <Leftbar />
        <Panel />
        {this.props.rightBar && <Rightbar/>}
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Dashboard);
