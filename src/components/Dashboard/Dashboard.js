import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Leftbar from "./Leftbar";
import Panel from "../Panel/Panel";
import Rightbar from "./Rightbar";
import PopupAvatar from "./PopupAvatar";
import Courses from "../Courses/Courses";
import DevPanel from "../DevPanel/DevPanel";

const mapStateToProps = state => ({
  ...state
});

class Dashboard extends React.Component {


  render() {
      return (
      <div className="Dashboard">
        {this.props.popupAvatar === true && <PopupAvatar />}
        <Leftbar />
        {this.props.location.pathname === "/dashboard" && <Panel />}
        {this.props.location.pathname === "/courses" && <Courses />}
        {this.props.location.pathname === "/devpanel" && <DevPanel />}
        {!window.matchMedia("(max-width: 750px)").matches &&
          this.props.rightBar && <Rightbar />}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard));
