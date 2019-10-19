import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Loader from "../elements/Loader";

const mapStateToProps = state => ({
  ...state
});

let lessons = {
  number: [],
  name: [],
  content: [],
  length: []
};

const db = firebase.firestore();

class LessonPage extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      name: props.match.params.name.replace(/%20/gi, " "),
      loader: true,
      style: "",
      svg: "",
      started: ""
    };
    this.loadLessons = this.loadLessons.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
  }

  render() {
    return (
      <div className="LessonPage">
    
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(LessonPage));
