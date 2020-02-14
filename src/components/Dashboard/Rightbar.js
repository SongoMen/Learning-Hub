import React from "react";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import {connect} from "react-redux";
import parse from "html-react-parser";

import Loader from "../elements/Loader";
import {setPopup} from "../../actions/actionsPanel";
import {logout} from "../auth";

const mapStateToProps = state => ({
  rightBar: state.rightBar,
});

const mapDispatchToProps = dispatch => ({
  setPopup: () => dispatch(setPopup(true)),
});

let courses = {
  name: [],
  length: [],
  style: [],
  svg: [],
  completedLessons: [],
};

const db = firebase.firestore();

class Rightbar extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      avatar: "",
      show: false,
      width: "",
      coursesLoader: true,
    };
  }
  getUserInfo() {
    let user = firebase.auth().currentUser.uid;
    firebase
      .storage()
      .ref(user)
      .getDownloadURL()
      .then(
        function(url) {
          if (this._isMounted) {
            this.setState({
              avatar: url,
            });
          }
        }.bind(this),
      )
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/learning-a4a51.appspot.com/o/download.png?alt=media&token=7053ef8a-57ad-4ec8-accf-1c10becd0195",
          });
        }
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.rightBar !== this.props.rightBar) {
      let right = this.props.rightBar ? "20%" : "0";
      if (this._isMounted) {
        this.setState({
          width: right,
        });
      }
    }
  }

  uploadImage() {
    this.props.setPopup();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserInfo();
    this.getStartedCourses();
    if (this._isMounted) {
      this.setState({
        width: "0",
      });
      setTimeout(() => {
        this.setState({
          show: true,
          width: "20%",
        });
      }, 300);
    }
  }

  getStartedCourses() {
    courses.name = [];
    courses.svg = [];
    courses.style = [];
    courses.length = [];
    let user = firebase.auth().currentUser.uid;
    let i = 0;
    db.collection("users")
      .doc(user)
      .collection("lessonsCompleted")
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0) {
          snapshot.forEach(doc => {
            if (i < 3) {
              courses.name.push(doc.id);
              courses.completedLessons.push(
                doc.data()["completed"].split(",").length - 1,
              );
              this.getLengthOfUserCourses(doc.id);
              i++;
            }
          });
        }
      });
  }

  getLengthOfUserCourses(name) {
    db.collection("courses")
      .doc(name)
      .get()
      .then(snapshot => {
        if (this._isMounted && typeof snapshot.data() !== "undefined") {
          courses.svg.push(snapshot.data()["svg"]);
          courses.style.push(snapshot.data()["style"]);
          if (typeof snapshot.data()["length"] !== "undefined")
            courses.length.push(snapshot.data()["length"]);
          else courses.length.push(10);
        }
      })
      .then(() => {
        if (this._isMounted) this.setState({coursesLoader: false});
      });
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    let useruid = firebase.auth().currentUser.uid;

    if (user.length > 24) {
      user = user.substring(0, 24) + "...";
    }

    return (
      <div style={{width: this.state.width}} className="Rightbar" id="RightBar">
        {this.state.show && (
          <div>
            <div className="Rightbar__logout">
              <h4>Logout</h4>
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
                onClick={() => logout()}
                aria-label="Sign out">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <path d="M16 17L21 12 16 7" />
                <path d="M21 12L9 12" />
              </svg>
            </div>
            <div className="Rightbar__user">
              {this.state.avatar !== "" ? (
                <div className="Rightbar__image">
                  <img alt={useruid} src={this.state.avatar} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    onClick={() => this.uploadImage()}
                    viewBox="0 0 24 24">
                    <path d="M12 5L12 19" />
                    <path d="M5 12L19 12" />
                  </svg>
                </div>
              ) : (
                <Loader />
              )}
              <h3>{user}</h3>
            </div>
            {courses.name.length > 0 && !this.state.coursesLoader && (
              <div className="Rightbar__currentCourses">
                {courses.name.map((val, indx) => {
                  return (
                    <div key={indx} className={"Rightbar__course"}>
                      {parse(String(courses.svg[parseInt(indx)]))}
                      <div>
                        <h5>{val}</h5>
                        <h5>Total lessons: {courses.length[parseInt(indx)]}</h5>
                      </div>
                      <span className="Rightbar__slider">
                        <span
                          style={{
                            width:
                              (courses.completedLessons[parseInt(indx)] /
                                courses.length[parseInt(indx)]) *
                                100 +
                              "%",
                          }}></span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Rightbar);
