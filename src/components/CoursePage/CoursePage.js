import React from "react";
import "firebase/firestore";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Loader from "../elements/Loader";
import parse from "html-react-parser";
import {Link} from "react-router-dom";

import ErrorMessage from "../elements/ErrorMessage";
import {lessonsRef} from "../_helpers";
import {ReactComponent as Tick} from "../../svgs/tick.svg";
import {ReactComponent as Arrow} from "../../svgs/arrow.svg";

const mapStateToProps = state => ({
  ...state,
});

let lessons = {
  id: [],
  name: [],
  content: [],
  length: [],
};

const db = firebase.firestore();

class CoursePage extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      name: props.match.params.name.replace(/%20/gi, " "),
      loader: true,
      style: "",
      svg: "",
      started: "",
      completedLessons: "",
    };
    this.loadLessons = this.loadLessons.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadLessons();
    this.loadCompletedLessons();
  }

  loadLessons() {
    lessons.name = [];
    lessons.content = [];
    lessons.length = [];
    lessons.id = [];
    let user = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("users")
      .doc(user)
      .collection("courses")
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0) {
          snapshot.forEach(doc => {
            if (doc.id === this.state.name && this._isMounted)
              this.setState({started: true});
          });
        } else if (this._isMounted) {
          this.setState({
            started: false,
          });
        }
      })
      .then(() => {
        db.collection("courses")
          .doc(this.state.name)
          .get()
          .then(snapshot => {
            if (this._isMounted && typeof snapshot.data() !== "undefined")
              this.setState({
                style: snapshot.data()["style"],
                svg: snapshot.data()["svg"],
              });
            lessons.length.push(snapshot.data()["length"]);
          })
          .then(() => {
            lessonsRef(this.state.name)
              .then(snapshot => {
                if (snapshot.docs.length > 0 && this._isMounted) {
                  snapshot.forEach(doc => {
                    lessons.id.push(doc.id);
                    lessons.name.push(doc.data()["title"]);
                    lessons.content.push(doc.data()["content"]);
                  });
                }
              })
              .then(() => {
                if (this._isMounted)
                  this.setState({
                    loader: false,
                  });
              })
              .catch(err => {
                if (this._isMounted)
                  this.setState({
                    loader: "error",
                  });
                console.error(err);
              });
          })
          .catch(err => {
            if (this._isMounted)
              this.setState({
                loader: "error",
              });
            console.error(err);
          });
      })
      .catch(err => {
        if (this._isMounted)
          this.setState({
            loader: "error",
          });
        console.error(err);
      });
  }

  startCourse() {
    let user = firebase.auth().currentUser.uid;
    db.collection("users")
      .doc(user)
      .collection("courses")
      .doc(this.state.name)
      .set({
        lastLesson: 0,
      })
      .then(() => {
        db.collection("users")
          .doc(user)
          .collection("lastcourse")
          .doc(this.state.name)
          .set({
            lastCourse: this.state.name,
            lastLesson: 0,
            svg: this.state.svg,
          })
          .then(
            function() {
              if (this._isMounted) this.setState({started: true});
            }.bind(this),
          )
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }

  loadCompletedLessons() {
    let user = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("users")
      .doc(user)
      .collection("lessonsCompleted")
      .doc(this.state.name)
      .get()
      .then(doc => {
        if (this._isMounted && typeof doc.data() !== "undefined")
          this.setState({completedLessons: doc.data()["completed"]});
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div className="CoursePage">
        {!this.state.loader && this.state.loader !== "error" && (
          <div className={"CoursePage__course " + this.state.style}>
            {parse(this.state.svg)}
            <h3>{this.state.name}</h3>
            <span className="line"></span>
            <h4>
              Number of lessons: <b>{lessons.length[0]}</b>
            </h4>
          </div>
        )}
        {this.state.loader && this.state.loader !== "error" && <Loader />}
        {this.state.started &&
        !this.state.loader &&
        this.state.loader !== "error" ? (
          <div className="CoursePage__lessonsContainer">
            {lessons.name.map((val, indx) => (
              <Link
                className="CoursePage__lesson"
                to={
                  "/course/" +
                  this.state.name +
                  "/" +
                  lessons.id[parseInt(indx)]
                }
                key={indx}>
                <div>
                  <div>
                    <h4>{val}</h4>
                    {this.state.completedLessons
                      .split(",")
                      .indexOf(lessons.id[parseInt(indx)]) > -1 && <Tick />}
                  </div>
                  <Arrow />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !this.state.loader &&
          this.state.loader !== "error" && (
            <div className="CoursePage__start">
              <h4>START COURSE</h4>
              <input
                type="button"
                className="form-btn"
                value="start"
                onClick={() => this.startCourse()}></input>
            </div>
          )
        )}
        {this.state.loader === "error" && <ErrorMessage />}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(CoursePage));
