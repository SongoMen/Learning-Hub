import React from "react";
import date from "date-and-time";
import "firebase/firestore";
import firebase from "firebase/app";
import { changeRightBar, setPopupDev } from "../../actions/actionsPanel";
import { connect } from "react-redux";
import Loader from "../elements/Loader";
import PopupDev from "../elements/PopupDev";
import parse from "html-react-parser";

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");
let status;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status)),
  setPopupDev: () => dispatch(setPopupDev(true))
});

let courses = {
  name: [],
  length: [],
  style: [],
  svg: []
};

let lessons = {
  name: [],
  content: [],
  title: []
};

class DevPanel extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      width: "68%",
      courses: "",
      edit: false,
      lessons: ""
    };
  }
  rightBarChange() {
    status = this.props.rightBar ? false : true;
    this.props.changeRightBar();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.rightBar !== this.props.rightBar) {
      let right = this.props.rightBar ? "68%" : "88%";
      if (this._isMounted) {
        this.setState({
          width: right
        });
      }
    }
  }

  loadAllCourses() {
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
            courses.name.push(doc.data()["name"]);
            courses.style.push(doc.data()["style"]);
            courses.svg.push(doc.data()["svg"]);
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

  loadAllLessonsFromCourse(name) {
    lessons.names = [];
    lessons.content = [];
    let i = 0;
    firebase
      .firestore()
      .collection("courses")
      .doc(name)
      .collection("lessons")
      .get()
      .then(snapshot => {
        if (snapshot.docs.length > 0 && this._isMounted) {
          snapshot.forEach(doc => {
            lessons.name.push(doc.id);
            lessons.content.push(doc.data()["content"]);
            lessons.title.push(doc.data()["title"]);

            console.log(doc.id);
            i++;
          });
          this.setState({
            courses: i
          });
        } else if (this._isMounted) {
          this.setState({
            lessons: 0
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
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadAllCourses();
    let right = this.props.rightBar ? "68%" : "88%";
    if (this._isMounted) {
      this.setState({
        width: right
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  courseView(id) {
    if (this._isMounted) {
      this.setState({
        edit: true
      });
    }
    this.loadAllLessonsFromCourse(courses.name[id]);
  }

  render() {
    return (
      <div
        style={{ width: this.state.width }}
        className="DevPanel"
        id="DevPanel"
      >
        {!this.state.edit ? (
          <div>
            <div className="DevPanel__title">
              <h3>Dev Panel</h3>
              <div className="DevPanel__time">
                <h4 className="DevPanel__date">{formatDate}</h4>
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
            <div className="DevPanel__topNav">
              <button
                onClick={() => this.props.setPopupDev()}
                type="button"
                className="form-btn"
              >
                CREATE NEW COURSE
              </button>
            </div>
            <div className="DevPanel__list">
              <h2>Courses</h2>
              {this.state.courses === 0 && <h3>No courses available.</h3>}
              {this.state.courses > 0 &&
                courses.name.map((val, indx) => {
                  return (
                    <div
                      key={indx}
                      className={
                        "courses__box " + courses.style[parseInt(indx)]
                      }
                      onClick={() => {
                        this.courseView(indx);
                      }}
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
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="DevPanel__edit">
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="button arrow"
              viewBox="0 0 24 24"
              onClick={() => {
                if (this._isMounted) this.setState({ edit: false });
              }}
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
            <div className="DevPanel__lessons">
              {lessons.name.map((val, indx) => (
                <div key={indx} className="DevPanel__lesson">
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
                    className="lessons__arrow"
                  >
                    <line x1="0" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              ))}
              <div className="form-btn">
                <h4>Add new Lesson</h4>
              </div>
            </div>
          </div>
        )}
        {this.props.popupDev === true && <PopupDev />}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevPanel);
