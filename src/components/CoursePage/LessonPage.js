import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Loader from "../elements/Loader";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import date from "date-and-time";

const mapStateToProps = state => ({
  ...state
});

const now = new Date();
const dateNow = date.format(now, "DD MMM, dddd");

const db = firebase.firestore();

let lessonsId = [];

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
      this.saveLearningTime();
    }, 5 * 1000));

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
      nextLesson: ""
    };
  }

  _handleKey(e) {
    switch (e.keyCode) {
      case 37:
        if (
          typeof lessonsId[
            lessonsId.indexOf(
              window.location.pathname.split("/")[3].replace(/%20/gi, " ")
            ) + -1
          ] !== "undefined"
        )
          window.location.href =
            "/course/" +
            window.location.pathname.split("/")[2].replace(/%20/gi, " ") +
            "/" +
            lessonsId[
              lessonsId.indexOf(
                window.location.pathname.split("/")[3].replace(/%20/gi, " ")
              ) + -1
            ];
        break;
      case 39:
        window.location.href =
          "/course/" +
          window.location.pathname.split("/")[2].replace(/%20/gi, " ") +
          "/" +
          lessonsId[
            lessonsId.indexOf(
              window.location.pathname.split("/")[3].replace(/%20/gi, " ")
            ) + 1
          ];
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
  }

  refreshTime() {
    if (this._isMounted) {
      const now = new Date();
      this.setState({ time: date.format(now, "HH:mm:ss, ") });
    }
  }

  saveLearningTime() {
    let user = firebase.auth().currentUser.uid;
    const today = date.format(now, "DD MMM YYYY");
    let timer;
    let userDates = db
      .collection("users")
      .doc(user)
      .collection("dates")
      .doc(today);
    let userLastLessons = db.collection("users").doc(user);
    userDates
      .collection("lessons")
      .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
      .get()
      .then(doc => {
        if (typeof doc.data() !== "undefined")
          timer = parseInt(doc.data()["time"]);
      })
      .then(() => {
        userDates.get().then(docSnapshot => {
          if (docSnapshot.exists) {
            userDates.update({
              doc: "doc"
            });
          } else {
            userDates.set({ doc: "doc" });
          }
        });
      });
    userDates
      .collection("lessons")
      .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
      .get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          userDates
            .collection("lessons")
            .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
            .update({
              time: parseInt(timer) + parseInt(this.state.timer)
            });
        } else {
          userDates
            .collection("lessons")
            .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
            .set({ time: this.state.timer });
        }
      })
      .then(() => {
        userLastLessons
          .collection("lastcourse")
          .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
          .update({
            lastLesson: this.state.title.split(".")[0],
            lessonId: window.location.pathname
              .split("/")[3]
              .replace(/%20/gi, " ")
          });
        if (this._isMounted) this.setState({ timer: 0 });
      });
  }

  loadLessonContent() {
    this.setState({ showLesson: true, edit: false });
    db.collection("courses")
      .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
      .collection("lessons")
      .doc(this.props.id)
      .get()
      .then(doc => {
        if (this._isMounted)
          this.setState({
            title: doc.data()["title"],
            content: doc.data()["content"],
            loader: false
          });
      })
      .catch(err => {
        console.error(
          "%c%s",
          "color: white; background: red;padding: 3px 6px;border-radius: 5px",
          "Error"
        );
        console.error(err);
        if (this._isMounted)
          this.setState({
            loader: "error"
          });
      });
  }
  getNextLessonId() {
    db.collection("courses")
      .doc(window.location.pathname.split("/")[2].replace(/%20/gi, " "))
      .collection("lessons")
      .orderBy("title", "asc")
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0 && this._isMounted) {
          snapshot.forEach(doc => {
            lessonsId.push(doc.id);
          });
        }
      });
  }

  lessonDone(){
    
  }

  render() {
    return (
      <div className="LessonPage">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="backwards"
                viewBox="0 0 24 24"
              >
                <path d="M19 12L5 12"></path>
                <path d="M12 19L5 12 12 5"></path>
              </svg>
              <h5>Previous lesson</h5>
            </div>
            <div className="LessonPage__option">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="forward"
              >
                <path d="M5 12L19 12"></path>
                <path d="M12 5L19 12 12 19"></path>
              </svg>
              <h5>Next lesson</h5>
            </div>
          </div>
        )}
        {this.state.loader === "error" && (
          <div className="CoursePage__error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
              <path d="M9 9L9.01 9" />
              <path d="M15 9L15.01 9" />
            </svg>
            <h1>ERROR</h1>
            <Link to="/dashboard">
              <h4>Go back to dashboard</h4>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(LessonPage));
