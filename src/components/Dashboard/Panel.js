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
import "firebase/firestore";
import humanizeDuration from "humanize-duration";

let status;

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "m",
      s: () => "s",
      ms: () => "ms"
    }
  }
});

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status))
});

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");

const db = firebase.firestore();

let courses = {
  name: [],
  length: [],
  style: [],
  svg: []
};

let stats = {
  date: [],
  time: [],
  styles: [],
  names: [],
  fullDates: []
};

class Panel extends React.Component {
  _isMounted = false;

  statCharts = () => {
    return stats.date.map((val, indx) => (
      <div className="Panel__day" key={indx}>
        <h5>{val}</h5>
        <div className="Panel__slider">
          {stats.time[parseInt(indx)] > 0 &&
            stats.styles.map((val2, indx2) => {
              if (
                stats.fullDates[parseInt(indx)] ===
                  val2.split(" ")[0] +
                    " " +
                    val2.split(" ")[1] +
                    " " +
                    val2.split(" ")[2] &&
                stats[stats.names[parseInt(indx2)]] > 0
              )
                return (
                  <div
                    key={indx2}
                    className={"Panel__slider-active " + val2}
                    style={{
                      height:
                        stats[stats.names[parseInt(indx2)]] /
                          this.state.maxValue ===
                        1
                          ? 100 + "%"
                          : (stats[stats.names[parseInt(indx2)]] /
                              this.state.maxValue) *
                              100 +
                            "%"
                    }}
                  ></div>
                );
            })}
        </div>
        <h5>
          {shortEnglishHumanizer(parseInt(stats.time[parseInt(indx)] * 1000), {
            largest: 2,
            round: true
          })}
        </h5>
      </div>
    ));
  };

  constructor() {
    super();
    this.state = {
      lastLesson: "",
      lastLessonLoader: true,
      width: "",
      courses: "",
      lastLessonNumber: "",
      svg: "",
      statsLoader: true,
      maxValue: "",
      lastWeek: false,
      selectValue: "This week",
      lessonId: ""
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
              lessonId: doc.data()["lessonId"],
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

  getThisWeekDates() {
    stats.date = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    stats.time = [];
    stats.styles = [];
    stats.names = [];
    stats.fullDates = [];
    const today = date.format(now, "DD MMM YYYY");
    let forward = 0;
    let backwards = 0;
    switch (date.format(now, "dddd")) {
      case "Monday":
        backwards = 0;
        forward = 6;
        break;
      case "Tuesday":
        backwards = 1;
        forward = 5;
        break;
      case "Wednesday":
        backwards = 2;
        forward = 4;
        break;

      case "Thursday":
        backwards = 3;
        forward = 3;
        break;
      case "Friday":
        backwards = 4;
        forward = 2;
        break;
      case "Saturday":
        backwards = 5;
        forward = 1;
        break;
      case "Sunday":
        backwards = 6;
        forward = 0;
        break;
      default:
        forward = 0;
        backwards = 0;
    }
    let datesWeek = [];
    let lastDate = parseInt(today.split(" ")[0]);
    let lastDate2 = parseInt(today.split(" ")[0]);
    let daysInMonth = new Date(
      date.format(now, "YYYY"),
      date.format(now, "M"),
      0
    ).getDate();
    datesWeek.push(lastDate);
    while (backwards > 0) {
      datesWeek.push(lastDate - 1);
      lastDate--;
      backwards--;
    }
    while (forward > 0) {
      if (daysInMonth < lastDate2) {
        lastDate2 = 0;
        datesWeek.push("33 " + (lastDate2 + 1));
      } else {
        datesWeek.push(lastDate2 + 1);
      }
      lastDate2++;
      forward--;
    }
    datesWeek.sort((a, b) => a - b);
    for (let i = 0; i < datesWeek.length; i++) {
      if (String(datesWeek[parseInt(i)]).split(" ").length === 1) {
        this.getStats(
          `${datesWeek[parseInt(i)]} ${date.format(now, "MMM YYYY")}`,
          i
        );
        stats.date[parseInt(i)] += ` ${datesWeek[parseInt(i)]} ${date.format(
          now,
          "MMM"
        )}`;
      } else {
        this.getStats(
          `${String(datesWeek[parseInt(i)]).split(" ")[1]} ${date.format(
            now,
            "MMM YYYY"
          )}`,
          i
        );
        stats.date[parseInt(i)] += ` ${
          String(datesWeek[parseInt(i)]).split(" ")[1]
        } ${date.format(now, "MMM")}`;
      }
    }
  }

  getLastWeekDates() {
    let backwards = 0;
    backwards = 6;
    let datesWeek = [];
    let lastDate = stats.date[0].split(" ")[1] - 1;
    stats.date = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    stats.time = [];
    stats.styles = [];
    stats.names = [];
    stats.fullDates = [];
    datesWeek.push(lastDate);
    while (backwards > 0) {
      datesWeek.push(lastDate - 1);
      lastDate--;
      backwards--;
    }
    datesWeek.sort((a, b) => a - b);

    for (let i = 0; i < datesWeek.length; i++) {
      if (String(datesWeek[parseInt(i)]).split(" ").length === 1) {
        this.getStats(
          `${datesWeek[parseInt(i)]} ${date.format(now, "MMM YYYY")}`,
          i
        );
        stats.date[parseInt(i)] += ` ${datesWeek[parseInt(i)]} ${date.format(
          now,
          "MMM"
        )}`;
      } else {
        this.getStats(
          `${String(datesWeek[parseInt(i)]).split(" ")[1]} ${date.format(
            now,
            "MMM YYYY"
          )}`,
          i
        );
        stats.date[parseInt(i)] += ` ${
          String(datesWeek[parseInt(i)]).split(" ")[1]
        } ${date.format(now, "MMM")}`;
      }
    }
  }

  getStats(date, i) {
    let user = firebase.auth().currentUser.uid;
    if (this._isMounted) this.setState({ statsLoader: true });
    let sum = 0;
    stats.fullDates.push(date);
    let userDates = db
      .collection("users")
      .doc(user)
      .collection("dates")
      .doc(date)
      .collection("lessons");
    userDates
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.getCourseStyle(doc.id, date);
          if (doc.exists === true) {
            sum += doc.data()["time"];
            stats.names.push(date + " " + doc.id);
            stats[date + " " + doc.id] = doc.data()["time"];
          } else {
            stats.time.push(0);
          }
        });
      })
      .then(() => {
        stats.time.push(sum);
        setTimeout(() => {
          if (i === 6 && this._isMounted) {
            this.setState({
              statsLoader: false,
              maxValue: Math.max(...stats.time)
            });
          }
        }, 1000);
      });
  }

  getCourseStyle(name, date) {
    db.collection("courses")
      .doc(name)
      .get()
      .then(snapshot => {
        stats.styles.push(date + " " + snapshot.data()["style"]);
        stats.styles.sort();
      });
  }

  changeWeek(event) {
    if (event.target.value === "Last week" && !this.state.lastWeek) {
      if (this._isMounted)
        this.setState({ lastWeek: true, selectValue: "Last week" });
      this.getLastWeekDates();
    } else {
      if (this._isMounted)
        this.setState({ lastWeek: false, selectValue: "This week" });
      this.getThisWeekDates();
    }
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
    this.getThisWeekDates();
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
        <div className="Panel__welcome">
          {!this.state.lastLessonLoader ? (
            this.state.lastLesson === "" ? (
              <div className="left">
                <h2> Welcome, {user}!</h2>
                <h4>
                  Looks like you didn't do any lessons yet
                  <br />
                  maybe you should start?
                </h4>
              </div>
            ) : (
              <div className="left">
                <h2> Welcome back, {user}!</h2>
                <h4>
                  Your latest course was <b>{this.state.lastLesson}.</b>
                </h4>
                {this.state.lastLessonNumber !== 0 ? (
                  <h4>
                    You ended up on{" "}
                    {ordinal(parseInt(this.state.lastLessonNumber))} lesson.
                  </h4>
                ) : (
                  <h4>But you didn't complete any lesson.</h4>
                )}
              </div>
            )
          ) : (
            <Loader />
          )}
        </div>
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
            ) : this.state.lastLesson > 0 ? (
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
            ) : (
              <Link
                to={
                  "/course/" + this.state.lastLesson + "/" + this.state.lessonId
                }
              >
                {" "}
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
          {this.state.statsLoader ? (
            <Loader />
          ) : (
            <div className="Panel__days">
              <h5>TIME SPENT ON LEARNING</h5>
              <div className="Panel__chart">{this.statCharts()}</div>
              <select
                value={this.state.selectValue}
                ref={select => (this.select = select)}
                onChange={this.changeWeek.bind(this)}
                className="Panel__selectWeek"
              >
                <option value="This week">This week</option>
                <option value="Last week">Last week</option>
              </select>
            </div>
          )}
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
