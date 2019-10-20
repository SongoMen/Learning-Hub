import React from "react";
import date from "date-and-time";
import "firebase/firestore";
import firebase from "firebase/app";
import { changeRightBar } from "../../actions/actionsPanel";
import { connect } from "react-redux";
import Loader from "../elements/Loader";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import ordinal from "ordinal";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status))
});

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");
let status;

const db = firebase.firestore();

let courses = {
  name: [],
  length: [],
  style: [],
  svg: []
};

let stats = {
  date:[],
  time:[]
}

class Panel extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      lastLesson: "",
      lastLessonLoader: true,
      width: "",
      courses: "",
      lastLessonNumber: "",
      svg: ""
    };
  }
  rightBarChange() {
    status = this.props.rightBar ? false : true;
    this.props.changeRightBar();
  }

  loadCourses() {
    let i = 0;
    firebase
      .firestore()
      .collection("courses")
      .get()
      .then(snapshot => {
        courses.name = [];
        courses.style = [];
        courses.svg = [];
        if (snapshot.docs.length > 0) {
          snapshot.forEach(doc => {
            i++;
            courses.name.push(doc.data()["name"]);
            courses.style.push(doc.data()["style"]);
            courses.svg.push(doc.data()["svg"]);
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
        if (this._isMounted) {
          this.setState({
            courses: "err"
          });
        }
      });
  }

  loadLastLesson() {
    let user = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("users")
      .doc(user)
      .collection("lastcourse")
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0 && this._isMounted) {
          snapshot.forEach(doc => {
            this.setState({
              lastLesson: doc.data()["lastCourse"],
              lastLessonNumber: doc.data()["lastLesson"],
              svg: doc.data()["svg"]
            });
          });
        } else if (this._isMounted) {
          this.setState({
            lastLesson: ""
          });
        }
      })
      .then(() => {
        if (this._isMounted) {
          this.setState({
            lastLessonLoader: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        if (this._isMounted) {
          this.setState({
            lastLessonLoader: false,
            lastLesson: "err"
          });
        }
      });
  }

  getStats() {
    let user = firebase.auth().currentUser.uid;
    const today = date.format(now, "DD MMM YYYY");

    let timer;
    let userDates = db
      .collection("users")
      .doc(user)
      .collection("dates")
      .doc(today);
    userDates.get().then(snapshot => {
      snapshot.forEach(doc => {
          console.log(doc.id)
          console.log(doc.data())
          stats.date.push(doc.id)
          stats.time.push(doc.data()["time"])
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
    this.loadLastLesson();
    this.loadCourses();
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

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    return (
      <div className={"Panel " + this.state.width} id="Panel">
        <div className="Panel__title">
          <h3>Dashboard</h3>
          <div className="Panel__time">
            <h4 className="Panel__date">{formatDate}</h4>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="button first"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21L16.65 16.65" />
            </svg>
            {this.props.rightBar ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="button"
                viewBox="0 0 24 24"
                onClick={() => this.rightBarChange()}
              >
                <path d="M5 12L19 12" />
                <path d="M12 5L19 12 12 19" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="button backwards"
                viewBox="0 0 24 24"
                onClick={() => this.rightBarChange()}
              >
                <path d="M5 12L19 12" />
                <path d="M12 5L19 12 12 19" />
              </svg>
            )}
          </div>
        </div>
        {this.state.lastLesson === "" ? (
          <div className="Panel__welcome">
            <div className="left">
              <h2> Welcome, {user}!</h2>
              <h4>
                Looks like you didn't do any lessons yet
                <br />
                maybe you should start?
              </h4>
            </div>
          </div>
        ) : (
          <div className="Panel__welcome">
            <div className="left">
              <h2> Welcome back, {user}!</h2>
              <h4>
                Your latest course was <b>{this.state.lastLesson}.</b>
              </h4>
              {this.state.lastLessonNumber !== 0 ? (
                <h4>
                  You ended up on{" "}
                  {ordinal(parseInt(this.state.lastLessonNumber))}.
                </h4>
              ) : (
                <h4>But you didn't complete any lesson.</h4>
              )}
            </div>
          </div>
        )}
        <div className="Panel__quickstart">
          {this.state.lastLessonLoader ? (
            <Loader />
          ) : this.state.lastLesson !== "err" ? (
            this.state.lastLesson === "" ? (
              <div className="Panel__notification">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="button"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 3L19 12 5 21 5 3z" />
                </svg>
                <h4>
                  This is the quick start panel, it will be available when you
                  start course.
                </h4>
              </div>
            ) : (
              <Link to={"/course/" + this.state.lastLesson}>
                <div>
                  <h5>QUICKSTART</h5>
                  <div className="title">
                    <span className="courseLogo">{parse(this.state.svg)}</span>
                    <h3>{this.state.lastLesson}</h3>
                    <h4>
                      Lesson: {ordinal(parseInt(this.state.lastLessonNumber))}
                    </h4>
                  </div>
                </div>
              </Link>
            )
          ) : (
            <div className="Panel__error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="feather feather-frown"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <path d="M9 9L9.01 9" />
                <path d="M15 9L15.01 9" />
              </svg>
              <h4>Looks like we couldn't connect to servers. Sorry!</h4>
            </div>
          )}
        </div>
        <div className="Panel__stats">
          <h5>TIME SPENT ON LEARNING</h5>
        </div>
        <div className="Panel__more">
          <h3>More courses</h3>
          {this.state.courses === 0 && <h3>No courses available.</h3>}
          {this.state.courses > 0 &&
            courses.name.map((val, indx) => {
              return (
                <Link to={"/course/" + val} key={indx}>
                  <div
                    className={"courses__box " + courses.style[parseInt(indx)]}
                  >
                    {parse(courses.svg[parseInt(indx)])}
                    <div className="courses__info">
                      <h5>Number of lessons</h5>
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
              );
            })}
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
