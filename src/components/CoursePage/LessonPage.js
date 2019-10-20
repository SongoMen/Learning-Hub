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
const dateNow = date.format(now, "DD MMM YYYY, dddd");

const db = firebase.firestore();

class LessonPage extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      name: props.match.params.name.replace(/%20/gi, " "),
      loader: true,
      title: "",
      content: "",
      time: "",
      timer: 0
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  refreshTime() {
    if (this._isMounted) {
      const now = new Date();
      this.setState({ time: date.format(now, "HH:mm:ss, ") });
    }
  }

  saveLearningTime() {
    if (!document.hidden) {
      let user = firebase.auth().currentUser.uid;
      const today = date.format(now, "DD MMM YYYY");
      let userDates = db
        .collection("users")
        .doc(user)
        .collection("dates")
        .doc(today);

      userDates.get().then(docSnapshot => {
        if (docSnapshot.exists) {
          userDates.update({
            time: this.state.timer
          });
        } else {
          userDates.set({ time: this.state.timer });
        }
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.refreshTime();
    setInterval(() => {
      this.refreshTime();
    }, 1000);
    setInterval(() => {
      if (!document.hidden && this._isMounted)
        this.setState({ timer: parseInt(this.state.timer) + 1 });
    }, 1000);
    setInterval(() => {
      this.saveLearningTime();
    }, 5 * 1000);
    this.loadLessonContent();
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
