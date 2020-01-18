import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Loader from "../elements/Loader";
import parse from "html-react-parser";
import { Redirect } from "react-router-dom";
import date from "date-and-time";
import ErrorMessage from "../elements/ErrorMessage";
import { lessonsRef } from "../_helpers";
import { ReactComponent as ArrowBackwards } from "../../svgs/lessonArrow.svg";
import { ReactComponent as Arrow } from "../../svgs/lessonArrow2.svg";

const mapStateToProps = state => ({
  ...state
});

const now = new Date();
const dateNow = date.format(now, "DD MMM, dddd");

const db = firebase.firestore();

let lessonsId = [];

let courses = {
  name: []
};

class LessonPage extends React.Component {
  refreshTimeInterval = () =>
    (this.refresh = setInterval(() => {
      this.refreshTime();
    }, 1000));

  timeCounterInterval = () =>
    (this.counter = setInterval(() => {
      if (!document.hidden && this._isMounted)
        this.setState({ timer: parseInt(this.state.timer) + 1 });
    }, 1000));

  saveLearningTimeInterval = () =>
    (this.saveToDb = setInterval(() => {
      this.saveLearningTime(
        window.location.pathname.split("/")[2].replace(/%20/gi, " ")
      );
    }, 5 * 1000));

  saveDoneLesson = () =>
    (this.done = setTimeout(() => {
      this.lessonDone(
        window.location.pathname.split("/")[2].replace(/%20/gi, " "),
        window.location.pathname.split("/")[3]
      );
    }, 30000));

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      name: props.match.params.name.replace(/%20/gi, " "),
      loader: true,
      title: "",
      content: "",
      time: "",
      timer: 0,
      nextLesson: "",
      redirect: ""
    };
    this._handleKey = this._handleKey.bind(this);
  }

  _handleKey(e) {
    let previousLesson =
      lessonsId[lessonsId.indexOf(window.location.pathname.split("/")[3]) - 1];
    let nextLesson =
      lessonsId[lessonsId.indexOf(window.location.pathname.split("/")[3]) + 1];
    switch (e.keyCode) {
      case 37:
        if (typeof previousLesson !== "undefined") {
          this.lessonDone(
            window.location.pathname.split("/")[2].replace(/%20/gi, " "),
            window.location.pathname.split("/")[3]
          );
          if (this._isMounted)
            this.setState(
              {
                redirect: "previous",
                loader: true
              },
              () => {
                this.setState({
                  redirect: ""
                });
              }
            );
        }
        break;
      case 39:
        if (typeof nextLesson !== "undefined") {
          this.lessonDone(
            window.location.pathname.split("/")[2].replace(/%20/gi, " "),
            window.location.pathname.split("/")[3]
          );
          if (this._isMounted)
            this.setState(
              {
                redirect: "next",
                loader: true
              },
              () => {
                this.setState({
                  redirect: ""
                });
              }
            );
        }
        break;
      default:
        break;
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    clearInterval(this.refresh);
    clearInterval(this.counter);
    clearInterval(this.saveToDb);
    clearInterval(this.done);

    document.removeEventListener("keydown", this._handleKey);
  }

  componentDidMount() {
    this._isMounted = true;
    //key press
    document.addEventListener("keydown", this._handleKey);
    //intervals
    this.refreshTimeInterval();
    this.timeCounterInterval();
    this.saveLearningTimeInterval();
    // functions
    this.refreshTime();
    this.loadLessonContent();
    this.getNextLessonId();
    this.saveDoneLesson();
    this.loadAllCourses();
  }

  componentDidUpdate(prevState) {
    if (prevState.id !== this.props.id) {
      this.loadLessonContent();
      this.getNextLessonId();
    }
  }

  loadAllCourses() {
    db.collection("courses")
      .get()
      .then(snapshot => {
        courses.name = [];
        if (snapshot.docs.length > 0) {
          snapshot.forEach(doc => {
            courses.name.push(doc.data()["name"]);
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  refreshTime() {
    if (this._isMounted) {
      const now = new Date();
      this.setState({ time: date.format(now, "HH:mm:ss, ") });
    }
  }

  saveLearningTime(name) {
    if (courses.name.indexOf(name) > -1) {
      let user = firebase.auth().currentUser.uid;
      const today = date.format(now, "DD MMM YYYY");
      let courseName = name;
      let timer;
      let userDates = db
        .collection("users")
        .doc(user)
        .collection("dates")
        .doc(today);
      let userLastLessons = db.collection("users").doc(user);

      if (typeof name !== "undefined") {
        userDates
          .collection("lessons")
          .doc(courseName)
          .get()
          .then(doc => {
            if (typeof doc.data() !== "undefined")
              timer = parseInt(doc.data()["time"]);
          })
          .then(() => {
            userDates.get().then(docSnapshot => {
              if (docSnapshot.exists) {
                userDates.update({
                  doc: "doc",
                  date: new Date()
                });
              } else {
                userDates.set({ doc: "doc", date: new Date() });
              }
            });
          });
        userDates
          .collection("lessons")
          .doc(courseName)
          .get()
          .then(docSnapshot => {
            if (docSnapshot.exists) {
              userDates
                .collection("lessons")
                .doc(courseName)
                .update({
                  time: parseInt(timer) + parseInt(this.state.timer)
                });
            } else {
              userDates
                .collection("lessons")
                .doc(courseName)
                .set({ time: this.state.timer });
            }
          })
          .then(() => {
            userLastLessons
              .collection("lastcourse")
              .doc(courseName)
              .update({
                lastLesson: this.state.title.split(".")[0],
                lessonId: window.location.pathname.split("/")[3]
              });
            if (this._isMounted) this.setState({ timer: 0 });
          });
      }
    }
  }

  loadLessonContent() {
    db.collection("courses")
      .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
      .collection("lessons")
      .doc(this.props.id)
      .get()
      .then(doc => {
        if (this._isMounted && typeof doc.data() !== "undefined") {
          this.setState({
            title: doc.data()["title"],
            content: doc.data()["content"],
            loader: false
          });
        } else {
          if (this._isMounted)
            this.setState({
              loader: "error"
            });
        }
      })
      .catch(err => {
        console.error(err);
        if (this._isMounted)
          this.setState({
            loader: "error"
          });
      });
  }
  getNextLessonId() {
    lessonsRef(
      window.location.pathname.split("/")[2].replace(/%20/gi, " ")
    ).then(snapshot => {
      if (snapshot.docs.length > 0 && this._isMounted) {
        snapshot.forEach(doc => {
          lessonsId.push(doc.id);
        });
      }
    });
  }

  lessonDone(name, id) {
    this.saveLearningTime(name);
    let user = firebase.auth().currentUser.uid;
    let lessons = "";
    let lessonsCompleted = db
      .collection("users")
      .doc(user)
      .collection("lessonsCompleted")
      .doc(name);
    lessonsCompleted.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        lessonsCompleted
          .get()
          .then(doc => {
            lessons = doc.data()["completed"];
          })
          .then(() => {
            if (typeof lessons !== "undefined") {
              if (lessons.split(",").indexOf(id) === -1) {
                lessonsCompleted.update({
                  completed: lessons + "," + id
                });
              }
            }
          });
      } else {
        if (typeof window.location.pathname.split("/")[3] !== "undefined")
          lessonsCompleted.set({
            completed: lessons + "," + id
          });
      }
    });
  }

  render() {
    let previousLesson =
      lessonsId[
        lessonsId.indexOf(
          window.location.pathname.split("/")[3].replace(/%20/gi, " ")
        ) - 1
      ];
    let nextLesson =
      lessonsId[
        lessonsId.indexOf(
          window.location.pathname.split("/")[3].replace(/%20/gi, " ")
        ) + 1
      ];
    return (
      <div className="LessonPage">
        {this.state.redirect === "next" &&
          typeof nextLesson !== "undefined" && (
            <Redirect
              to={`/course/${window.location.pathname
                .split("/")[2]
                .replace(/%20/gi, " ")}/${nextLesson}`}
            />
          )}
        {this.state.redirect === "previous" &&
          typeof nextLesson !== "undefined" && (
            <Redirect
              to={`/course/${window.location.pathname
                .split("/")[2]
                .replace(/%20/gi, " ")}/${previousLesson}`}
            />
          )}
        {this.state.loader && this.state.loader !== "error" && <Loader />}
        {!this.state.loader && this.state.loader !== "error" && (
          <div className="LessonPage__time">
            <b>{this.state.time}</b>
            {dateNow}
          </div>
        )}
        {this.state.loader !== "error" && !this.state.loader && (
          <div className="LessonPage__lesson">
            <h2>{this.state.title}</h2>
            <p>{parse(this.state.content)}</p>
          </div>
        )}
        {this.state.loader !== "error" && !this.state.loader && (
          <div className="LessonPage__controls">
            <div className="LessonPage__option">
              <ArrowBackwards />
              <h5>Previous lesson</h5>
            </div>
            <div className="LessonPage__option">
              <Arrow />
              <h5>Next lesson</h5>
            </div>
          </div>
        )}
        {this.state.loader === "error" && <ErrorMessage />}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(LessonPage));
