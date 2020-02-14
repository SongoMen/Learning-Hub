import React from "react";
import "firebase/firestore";
import {connect} from "react-redux";
import firebase from "firebase/app";

import {changeRightBar} from "../../actions/actionsPanel";
import Loader from "../elements/Loader";
import TopPanel from "../Dashboard/Topbar";
import ErrorMessaage from "../elements/ErrorMessage";
import CourseWrapper from "../elements/CourseWrapper";

let status;

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status)),
});

const db = firebase.firestore();

let courses = {
  name: [],
  length: [],
  style: [],
  svg: [],
};

class Courses extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      lastLesson: "",
      lastLessonLoader: true,
      width: "",
      courses: "",
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.rightBar !== this.props.rightBar) {
      let right = this.props.rightBar ? "" : "active";
      if (this._isMounted) {
        this.setState({
          width: right,
        });
      }
    }
  }

  loadAllCourses() {
    let i = 0;
    db.collection("courses")
      .get()
      .then(snapshot => {
        courses.name = [];
        courses.style = [];
        courses.svg = [];
        if (snapshot.docs.length > 0) {
          snapshot.forEach(doc => {
            courses.name.push(doc.data()["name"]);
            courses.style.push(doc.data()["style"]);
            courses.svg.push(doc.data()["svg"]);
            courses.length.push(doc.data()["length"]);
            i++;
          });
          if (this._isMounted) {
            this.setState({
              courses: i,
            });
          }
        } else {
          if (this._isMounted) {
            this.setState({
              courses: 0,
            });
          }
        }
      })
      .catch(err => {
        this.setState({
          courses: "err",
        });
        console.error(err);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    let right = this.props.rightBar ? "" : "active";
    if (this._isMounted) {
      this.setState({
        width: right,
      });
    }
    this.loadAllCourses();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className={"Courses " + this.state.width} id="Courses">
        <TopPanel name="All courses" />
        <div className="Courses__list">
          {this.state.courses === "" ? (
            <Loader />
          ) : (
            courses.name.map((val, indx) => (
              <CourseWrapper
                name={val}
                index={indx}
                style={courses.style[parseInt(indx)]}
                length={courses.length[parseInt(indx)]}
                svg={courses.svg[parseInt(indx)]}
                key={indx}
              />
            ))
          )}
        </div>
        {this.state.courses === "err" && <ErrorMessaage />}
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Courses);
