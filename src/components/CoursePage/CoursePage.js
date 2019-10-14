import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Leftbar from "../Dashboard/Leftbar";

const mapStateToProps = state => ({
  ...state
});

class Dashboard extends React.Component {
  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    return (
      <div className="CoursePage">
        <Leftbar />{" "}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard));
