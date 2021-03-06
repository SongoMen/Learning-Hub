import React from "react";
import "firebase/firestore";
import firebase from "firebase/app";
import {connect} from "react-redux";
import parse from "html-react-parser";

import {changeRightBar, setPopupDev} from "../../actions/actionsPanel";
import PopupDev from "./PopupDev";
import Loader from "../elements/Loader";
import TopPanel from "../Dashboard/Topbar";
import {lessonsRef} from "../_helpers";
import {ReactComponent as Refresh} from "../../svgs/refresh.svg";
import {ReactComponent as X} from "../../svgs/x.svg";

let status;

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status)),
  setPopupDev: () => dispatch(setPopupDev(true)),
});

const db = firebase.firestore();

let admin = false; //ADMIN STATUS

let courses = {
  name: [],
  length: [],
  style: [], //LOAD ALL COURSES
  svg: [],
};

let lessons = {
  name: [],
  content: [], //LOAD ALL LESSONS
  id: [],
};

let content = {
  title: [],
  content: [], // LOAD SPECIFIC LESSON FROM COURSE
};

class DevPanel extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      width: "",
      courses: "",
      edit: false,
      lessons: "",
      showLesson: false,
      courseName: "",
      lessonId: "",
      addLesson: false,
      loaded: false,
      name: "",
      courseId: "",
      lessonLoader: true,
    };
  }
  rightBarChange() {
    status = this.props.rightBar ? false : true;
    this.props.changeRightBar();
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
        console.error(err);
        this.setState({
          courses: "err",
        });
      });
  }

  loadAllLessonsFromCourse(name) {
    if (this._isMounted)
      this.setState({
        courseName: name,
      });
    lessons.name = [];
    lessons.content = [];
    let i = 0;
    lessonsRef(name)
      .then(snapshot => {
        if (snapshot.docs.length > 0 && this._isMounted) {
          snapshot.forEach(doc => {
            lessons.name.push(doc.data()["title"]);
            lessons.content.push(doc.data()["content"]);
            lessons.id.push(doc.id);
            i++;
          });
          this.setState({
            courses: i,
          });
        } else if (this._isMounted) {
          this.setState({
            lessons: 0,
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    let user = firebase.auth().currentUser.uid;

    this._isMounted = true;
    this.loadAllCourses();
    let right = this.props.rightBar ? "" : "active";
    if (this._isMounted) {
      this.setState({
        width: right,
      });
    }
    db.collection("users")
      .doc(user)
      .onSnapshot(
        function(doc) {
          if (typeof doc.data() !== "undefined") {
            admin = doc.data()["admin"];
            this.setState({
              loaded: true,
            });
          }
        }.bind(this),
      );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  courseView(id) {
    if (this._isMounted) {
      this.setState({
        edit: true,
        name: courses.name[parseInt(id)],
        courseId: id,
      });
    }
    this.loadAllLessonsFromCourse(courses.name[parseInt(id)]);
  }

  loadLessonContent(lesson, id) {
    this.setState({showLesson: true, edit: false, lessonLoader: true});
    db.collection("courses")
      .doc(this.state.courseName)
      .collection("lessons")
      .doc(lesson)
      .get()
      .then(doc => {
        content.content[parseInt(0)] = doc.data()["content"];
        content.title[parseInt(0)] = doc.data()["title"];
        if (this._isMounted) this.setState({lessonId: id});
      })
      .then(() => {
        this.setState({lessonLoader: false});
      })
      .catch(err => {
        console.error(err);
      });
  }

  addNewLesson() {
    let lessonNumber = 0;
    if (this.text.value.length > 0 && this.title.value.length > 0) {
      db.collection("courses")
        .doc(this.state.courseName)
        .get()
        .then(doc => {
          lessonNumber = doc.data()["length"];
        })
        .then(() => {
          db.collection("courses")
            .doc(this.state.courseName)
            .update({
              length: parseInt(lessonNumber) + 1,
            })
            .then(() => {
              db.collection("courses")
                .doc(this.state.courseName)
                .collection("lessons")
                .doc()
                .set({
                  title: this.title.value,
                  content: this.text.value,
                })
                .catch(error => {
                  console.log("Error getting document:", error);
                });
            })
            .then(() => {
              this.courseView(this.state.courseId);
            });
        });
    }
  }

  render() {
    return (
      <section className={`Dev-panel ${this.state.width}`} id="Dev-panel">
        {!this.state.loaded ? (
          <Loader />
        ) : (
          admin &&
          !this.state.edit &&
          !this.state.showLesson &&
          !this.state.addNewLesson && (
            <div className="Dev-panel__content">
              <TopPanel name="Dev Panel" />
              <div className="Dev-panel__topNav">
                <button
                  onClick={() => this.props.setPopupDev()}
                  type="button"
                  className="form-btn">
                  CREATE NEW COURSE
                </button>
              </div>
              <div className="Dev-panel__list">
                <h2>Courses</h2>
                {this.state.courses === 0 && <h3>No courses available.</h3>}
                <div className="Dev-panel__all">
                  {this.state.courses > 0 &&
                    courses.name.map((val, indx) => {
                      return (
                        <div
                          key={indx}
                          className={`courses__box ${
                            courses.style[parseInt(indx)]
                          }`}
                          onClick={() => {
                            this.courseView(indx);
                          }}>
                          {parse(courses.svg[parseInt(indx)])}
                          <div className="courses__info">
                            <h5>
                              Total lessons: {courses.length[parseInt(indx)]}
                            </h5>
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
                            className="courses__arrow">
                            <line x1="0" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )
        )}
        {this.state.edit && (
          <div className="Dev-panel__edit">
            <Refresh
              onClick={() => {
                this.loadAllLessonsFromCourse(this.state.courseName);
              }}></Refresh>
            <X
              onClick={() => {
                if (this._isMounted) this.setState({edit: false});
              }}
            />
            <div className="Dev-panel__lessons">
              {lessons.name.map((val, indx) => (
                <div
                  key={indx}
                  className="Dev-panel__lesson"
                  onClick={() =>
                    this.loadLessonContent(lessons.id[parseInt(indx)], indx)
                  }>
                  <h4>{val}</h4>
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
                    className="lessons__arrow">
                    <line x1="0" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              ))}
              <div
                onClick={() => this.setState({addNewLesson: true, edit: false})}
                className="form-btn">
                <h4>Add new Lesson</h4>
              </div>
            </div>
          </div>
        )}
        {this.state.showLesson && !this.state.addNewLesson && !this.state.edit && (
          <div className="Dev-panel__lessonContent">
            <X
              onClick={() => {
                if (this._isMounted)
                  this.setState({edit: false, showLesson: false});
              }}
            />
            {!this.state.lessonLoader && (
              <div className="Dev-panel__lessonText">
                <h2> {parse(String(content.title[parseInt(0)]))}</h2>
                <p> {parse(String(content.content[parseInt(0)]))}</p>
              </div>
            )}
          </div>
        )}
        {this.state.addNewLesson && !this.state.showLesson && !this.state.edit && (
          <div className="Dev-panel__lessonContent">
            <X
              onClick={() => {
                if (this._isMounted)
                  this.setState({
                    edit: true,
                    showLesson: false,
                    addNewLesson: false,
                  });
              }}
            />
            <div className="Dev-panel__lessonText new">
              <input
                type="text"
                placeholder="Title"
                ref={title => (this.title = title)}></input>
              <textarea
                placeholder="Text"
                ref={text => (this.text = text)}></textarea>
            </div>
            <br />
            <button
              type="text"
              className="form-btn"
              onClick={() => {
                this.addNewLesson();
              }}>
              ADD LESSON
            </button>
          </div>
        )}
        {this.props.popupDev === true && <PopupDev />}
      </section>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DevPanel);
