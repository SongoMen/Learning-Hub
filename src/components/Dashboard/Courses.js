import React from "react";
import "firebase/firestore";
import { changeRightBar } from "../../actions/actionsPanel";
import { connect } from "react-redux";
import Loader from "../elements/Loader";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import TopPanel from "./TopPanel";

let status;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status))
});

const db = firebase.firestore();

let courses = {
  name: [],
  length: [],
  style: [],
  svg: []
};

class Courses extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      lastLesson: "",
      lastLessonLoader: true,
      width: "",
      courses: ""
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.rightBar !== this.props.rightBar) {
      let right = this.props.rightBar ? "" : "active";
      if (this._isMounted) {
        this.setState({
          width: right
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
              courses: i
            });
          }
        } else {
          if (this._isMounted) {
            this.setState({
              courses: 0
            });
          }
        }
      })
      .catch(() => {
        console.error(
          "%c%s",
          "color: white; background: red;padding: 3px 6px;border-radius: 5px",
          "Error"
        );
        this.setState({
          courses: "err"
        });
      });
  }

  componentDidMount() {
    this._isMounted = true;
    let right = this.props.rightBar ? "" : "active";
    if (this._isMounted) {
      this.setState({
        width: right
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
              <Link to={"/course/" + val} key={indx}>
                <div
                  className={"courses__box " + courses.style[parseInt(indx)]}
                >
                  {parse(courses.svg[parseInt(indx)])}
                  <div className="courses__info">
                    <h5>Total lessons: {courses.length[parseInt(indx)]}</h5>
                    <h4>{val}</h4>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="courses__arrow"
                  >
                    <line x1="0" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses);
