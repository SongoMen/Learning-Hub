import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Leftbar from "../Dashboard/Leftbar";
import CoursePage from "./CoursePage";
import LessonPage from "./LessonPage";

const mapStateToProps = state => ({
  ...state
});
class CourseContainer extends React.Component {
  _isMounted = false;

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }
  render() {
    return (
      <div className="CourseContainer">
        <Leftbar />
        {typeof window.location.pathname.split("/")[3] === "undefined" ? (
          <CoursePage name={this.props.name} />
        ) : (
          <LessonPage id={window.location.pathname.split("/")[3]} />
        )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(CourseContainer));
