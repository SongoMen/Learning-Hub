import React from "react";
import "firebase/firestore";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Loader from "../elements/Loader";
import parse from "html-react-parser";

const mapStateToProps = state => ({
  ...state
});

let lessons = {
  number: [],
  name: [],
  content: []
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
      svg: ""
    };
    this.loadLessons = this.loadLessons.bind(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;
    this.loadLessons();
  }

  loadLessons() {
    lessons.name = [];
    lessons.content = [];
    let num = 1;
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
            console.log(doc.data());
          });
        } else {
          if (this._isMounted) {
            this.setState({
              started: false
            });
          }
        }
      })
      .then(() => {
        db.collection("courses")
          .doc(this.state.name)
          .get()
          .then(snapshot => {
            if (this._isMounted)
              this.setState({
                style: snapshot.data()["style"],
                svg: snapshot.data()["svg"]
              });
          })
          .then(() => {
            db.collection("courses")
              .doc(this.state.name)
              .collection("lessons")
              .get()
              .then(snapshot => {
                if (snapshot.docs.length > 0 && this._isMounted) {
                  snapshot.forEach(doc => {
                    lessons.number.push(num);
                    num++;
                    lessons.name.push(doc.id);
                    lessons.content.push(doc.data()["content"]);
                  });
                }
              })
              .then(() => {
                if (this._isMounted) {
                  this.setState({
                    loader: false
                  });
                }
              })
              .catch(err => {
                console.error(
                  "%c%s",
                  "color: white; background: red;padding: 3px 6px;border-radius: 5px",
                  "Error"
                );
                console.error(err);
              });
          })
          .catch(err => {
            console.error(
              "%c%s",
              "color: white; background: red;padding: 3px 6px;border-radius: 5px",
              "Error"
            );
            console.error(err);
          });
      })
      .catch(err => {
        console.error(
          "%c%s",
          "color: white; background: red;padding: 3px 6px;border-radius: 5px",
          "Error"
        );
        console.error(err);
      });
  }

  startCourse() {}

  render() {
    return (
      <div className="CoursePage">
        {!this.state.loader && (
          <div className={"CoursePage__course " + this.state.style}>
            {parse(this.state.svg)}
            <h3>{this.state.name}</h3>
          </div>
        )}
        {this.state.loader && <Loader />}
        {this.state.started === "" && !this.state.loader
          ? lessons.name.map((val, indx) => (
              <div
                key={indx}
                className="CoursePage__lesson"
                onClick={() => this.loadLessonContent(val, indx)}
              >
                <h4>
                  {lessons.number[parseInt(indx)]}. {val}
                </h4>
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
                  className="lessons__arrow"
                >
                  <line x1="0" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            ))
          : !this.state.loader && (
              <input
                type="button"
                className="form-btn"
                value="start course"
                onClick={() => this.startCourse()}
              ></input>
            )}
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(CoursePage));
