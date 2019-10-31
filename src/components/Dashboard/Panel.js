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

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

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
              else return "";
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
    let lastDateX = 0; //TO SORT CORRECTLY WHILE TRANSITION BETWEEN ONE MONTH TO ANOTHER
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
      if (daysInMonth <= lastDate2) {
        datesWeek.push("33 " + (lastDateX + 1));
        lastDateX++;
      } else {
        datesWeek.push(lastDate2 + 1);
      }
      lastDate2++;
      forward--;
    }
    datesWeek.sort((a, b) => a - b);
    let newMonth = false;
    let nextMonth = months[months.indexOf(date.format(now, "MMM")) + 1];
    for (let i = 0; i < datesWeek.length; i++) {
      if (String(datesWeek[parseInt(i)]).split(" ").length === 1 && !newMonth) {
        this.getStats(
          `${datesWeek[parseInt(i)]} ${date.format(now, "MMM YYYY")}`,
          i
        );
        stats.date[parseInt(i)] += ` ${datesWeek[parseInt(i)]} ${date.format(
          now,
          "MMM"
        )}`;
      } else {
        if (String(datesWeek[parseInt(i)]).split(" ").length > 1) {
          this.getStats(
            `${datesWeek[parseInt(i)].split(" ")[1]} ${nextMonth} ${date.format(
              now,
              "YYYY"
            )}`,
            i
          );
          stats.date[parseInt(i)] += ` ${
            datesWeek[parseInt(i)].split(" ")[1]
          } ${nextMonth}`;
          newMonth = true;
        }
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
        if (typeof snapshot.data() !== "undefined") {
          stats.styles.push(date + " " + snapshot.data()["style"]);
          stats.styles.sort();
        }
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
          {!this.state.lastLessonLoader && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              data-name="Layer 1"
              viewBox="0 0 407.22 332.41"
            >
              <defs>
                <linearGradient
                  id="a"
                  x1="154.44"
                  x2="204.69"
                  y1="220.63"
                  y2="239.78"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0.01"></stop>
                  <stop offset="0.12" stopOpacity="0.75"></stop>
                  <stop offset="1" stopOpacity="0"></stop>
                </linearGradient>
                <linearGradient
                  id="b"
                  x1="128.92"
                  x2="113.67"
                  y1="276.06"
                  y2="184.09"
                  xlinkHref="#a"
                ></linearGradient>
                <linearGradient
                  id="c"
                  x1="134.36"
                  x2="159.48"
                  y1="270.94"
                  y2="214.41"
                  xlinkHref="#a"
                ></linearGradient>
                <linearGradient
                  id="d"
                  x1="262.98"
                  x2="219.92"
                  y1="213.1"
                  y2="357.78"
                  xlinkHref="#a"
                ></linearGradient>
                <linearGradient
                  id="e"
                  x1="85.31"
                  x2="127.03"
                  y1="219.96"
                  y2="417.81"
                  xlinkHref="#a"
                ></linearGradient>
                <linearGradient
                  id="f"
                  x1="264.92"
                  x2="265.51"
                  y1="268.06"
                  y2="240.84"
                  gradientTransform="rotate(180 265.195 255.4)"
                  xlinkHref="#a"
                ></linearGradient>
                <linearGradient
                  id="g"
                  x1="307.69"
                  x2="311.73"
                  y1="284.87"
                  y2="182.58"
                  xlinkHref="#a"
                ></linearGradient>
              </defs>
              <rect
                style={{ isolation: "isolate" }}
                width="370.4"
                height="237.25"
                x="36.21"
                y="12.31"
                fill="#1f8efa"
                opacity="0.48"
                rx="8.95"
              ></rect>
              <path
                style={{ isolation: "isolate" }}
                fill="#1f8efa"
                d="M404.17 279.66c-.27 7.77-2.05 15.68-6.4 22.12-5.48 8.11-14.38 13.13-23 17.85l-24.44 13.45c-10.71 5.9-22 11.94-34.21 12.11-8.64.13-17-2.72-25.31-5.11-38.81-11.2-79.69-12.77-119.81-9.94-20.55 1.45-41 4-61.36 7.07-16.29 2.42-35.84 10.47-50.53.94-16-10.4-25.82-27.24-34.86-43.59-7.87-14.19-15.85-28.73-18.45-44.74-4-24.74 5.58-50.15 20.57-70.25a161.15 161.15 0 0114.73-17v90.83a9 9 0 008.95 9h352.49a70.17 70.17 0 011.63 17.26zM272.47 25.1h-94.25a56.62 56.62 0 0111.48-6.76c7.45-3.25 15.57-4.7 23.67-5.28 20.38-1.47 40.82 3.03 59.1 12.04z"
                opacity="0.18"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#1f8efa"
                d="M186.23 232.48a14.62 14.62 0 003.27 3.16 15.28 15.28 0 006 1.78l31.92 4.81a1.85 1.85 0 01.89.3 1.82 1.82 0 01.47 1.44 56.17 56.17 0 01-2.39 17.66 2.44 2.44 0 01-.65 1.24 2.56 2.56 0 01-1.46.44c-10.74.91-21.53.62-32.3.33a22 22 0 01-5.38-.59c-3-.84-5.45-2.89-7.71-5-4.85-4.51-24.48-22.64-25.67-25.1a67.19 67.19 0 01-3.8-10.92c-1-3.6 6.31-4.05 6.16-7.79a24.17 24.17 0 01.92-7.66 13.08 13.08 0 013.2-5.92c1.1-1-.6-7.78.92-7.86 1.76 6 9.72 18 13.18 23.14a193.68 193.68 0 0012.43 16.54z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="url(#a)"
                d="M186.23 232.48a14.62 14.62 0 003.27 3.16 15.28 15.28 0 006 1.78l31.92 4.81a1.85 1.85 0 01.89.3 1.82 1.82 0 01.47 1.44 56.17 56.17 0 01-2.39 17.66 2.44 2.44 0 01-.65 1.24 2.56 2.56 0 01-1.46.44c-10.74.91-21.53.62-32.3.33a22 22 0 01-5.38-.59c-3-.84-5.45-2.89-7.71-5-4.85-4.51-24.48-22.64-25.67-25.1a67.19 67.19 0 01-3.8-10.92c-1-3.6 6.31-4.05 6.16-7.79a24.17 24.17 0 01.92-7.66 13.08 13.08 0 013.2-5.92c1.1-1-.6-7.78.92-7.86 1.76 6 9.72 18 13.18 23.14a193.68 193.68 0 0012.43 16.54z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#1f8efa"
                d="M105.46 181.82a58.54 58.54 0 00-6 6.2c-4.42 5.43-7.36 11.89-10.1 18.33-7.29 17.14-13.64 35.47-11.75 54a7 7 0 00.88 3.18 6.19 6.19 0 003.43 2.21c3.51 1.12 7.26 1.17 11 1.2 14.41.13 28.84.26 43.24-.44 2.23-.11 4.59-.28 6.44-1.54a10.44 10.44 0 003.14-3.93c3.87-7.28 5-15.7 8-23.36 4-10 15-19.09 12.68-29.63-9.92-44.75-56.42-30.35-60.96-26.22z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="url(#b)"
                d="M105.46 181.82a58.54 58.54 0 00-6 6.2c-4.42 5.43-7.36 11.89-10.1 18.33-7.29 17.14-13.64 35.47-11.75 54a7 7 0 00.88 3.18 6.19 6.19 0 003.43 2.21c3.51 1.12 7.26 1.17 11 1.2 14.41.13 28.84.26 43.24-.44 2.23-.11 4.59-.28 6.44-1.54a10.44 10.44 0 003.14-3.93c3.87-7.28 5-15.7 8-23.36 4-10 15-19.09 12.68-29.63-9.92-44.75-56.42-30.35-60.96-26.22z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#ffdad2"
                d="M170.58 144.75c-1.69 8.21-3.46 16.64-8 23.71a18.36 18.36 0 01-6.93 6.82c-2.93 1.47-6.65 1.67-9.39-.13-1.37-.89-2.87-2.29-4.36-1.63-1.08.49-1.43 1.83-1.58 3a30.2 30.2 0 00.12 8.65 7.31 7.31 0 01.14 2.46 4.06 4.06 0 01-3.25 3 7.75 7.75 0 01-4.53-.71 14.64 14.64 0 01-8.44-10.82 35.06 35.06 0 01-.3-4.8c-.19-7.12-1.32-14.21-1.09-21.32s2-14.51 6.83-19.76a31.12 31.12 0 019.76-6.76c5.45-2.6 11.53-4.43 17.49-3.48a16.62 16.62 0 0111.57 7.72c3.12 4.79 3.13 8.36 1.96 14.05z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#3f3d56"
                d="M185.47 126.66a16.55 16.55 0 00-8.75-16.66c-2.65-1.32-5.6-1.88-8.46-2.64-6.7-1.8-13.13-4.78-20-5.42s-14.77 1.77-17.83 8c-.56 1.14-1.11 2.52-2.34 2.82a5.13 5.13 0 01-2-.18c-4.59-.81-8.72 3.11-10.79 7.28-3.34 6.75-3.51 14.62-2.78 22.11.67 6.93 2.44 14.42 8 18.64.55.42 1.36.8 1.89.35a1.58 1.58 0 00.43-.93 30.4 30.4 0 00.62-8c-.11-2-.43-4.12.09-6.09s2.19-3.84 4.23-3.78c1.89 0 3.41 1.76 3.88 3.6a13.28 13.28 0 01-.21 5.64c.3.75 1.35-.15 1.53-.93 1.38-6.28 1.69-13.31 6.05-18a7.73 7.73 0 011.88 3.27 5 5 0 015.15-1.28 12.24 12.24 0 013.44 2.25c10.62 8.29 33.74 5.83 35.97-10.05z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#1f8efa"
                d="M108.52 192.06c-3.36 2.44-5 6.73-5.1 10.87s4.28 30.41 8.41 37.87c3.2 5.8 9.87 20.94 20 25.12 3 1.24 47.35.72 67.93-1.51-.13-4.87-.37-9.74-.69-14.61a2.77 2.77 0 00-.55-1.79c-.52-.54-1.26-4.07-2-4.07-12 .05-24.1 3.72-36.1 4a21.12 21.12 0 01-5.21-.31 15 15 0 01-4-1.64c-9.26-5.24-14.38-15.53-18-25.54-2.77-7.72-5-15.71-9-22.92-1.42-2.57-2.69-5.07-5.49-6.2-3.29-1.33-7.15-1.48-10.2.73z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="url(#c)"
                d="M108.52 192.06c-3.36 2.44-5 6.73-5.1 10.87s4.28 30.41 8.41 37.87c3.2 5.8 9.87 20.94 20 25.12 3 1.24 47.35.72 67.93-1.51-.13-4.87-.37-9.74-.69-14.61a2.77 2.77 0 00-.55-1.79c-.52-.54-1.26-4.07-2-4.07-12 .05-24.1 3.72-36.1 4a21.12 21.12 0 01-5.21-.31 15 15 0 01-4-1.64c-9.26-5.24-14.38-15.53-18-25.54-2.77-7.72-5-15.71-9-22.92-1.42-2.57-2.69-5.07-5.49-6.2-3.29-1.33-7.15-1.48-10.2.73z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#ffdad2"
                d="M198 243c6.23-.59 13.15.8 17.1 5.65a3 3 0 01.78 1.6 2.68 2.68 0 01-.48 1.51c-2.33 3.87-7.39 4.79-11.64 6.32a30.22 30.22 0 00-6.29 3.12 10 10 0 01-3.76 1.86c-3 .45-5.49-2.23-6.85-4.91-1.56-3-4-9.16-1-12 2.45-2.25 9.06-2.87 12.14-3.15zM249.59 241.46a8.53 8.53 0 012.79 2.55 3.67 3.67 0 01.26 3.63 5.05 5.05 0 01-1.87 1.68c-5.53 3.29-12.31 3.88-17.91 7A9.73 9.73 0 01229 258a5.33 5.33 0 01-4.28-2 13.6 13.6 0 01-2.31-4.27c-6.55-17.2 17.76-16.27 27.18-10.27z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#fff"
                d="M86.23 221h25.91v21.28a7.5 7.5 0 01-7.5 7.5H93.73a7.5 7.5 0 01-7.5-7.5V221z"
              ></path>
              <path
                fill="none"
                stroke="#fff"
                strokeMiterlimit="10"
                strokeWidth="3.3"
                d="M110.39 226.16h7.85a6.25 6.25 0 016.25 6.25V235a6.25 6.25 0 01-6.25 6.25h-7.85 0v-15.09h0z"
              ></path>
              <rect
                width="362.1"
                height="11.11"
                x="45.12"
                y="249.32"
                fill="#1f8efa"
                rx="5.56"
              ></rect>
              <path
                fill="#1f8efa"
                d="M138.75 260.6H337.14V329.41H138.75z"
              ></path>
              <path
                fill="#1f8efa"
                d="M62.17 260.6H140.10000000000002V329.41H62.17z"
              ></path>
              <path
                fill="url(#d)"
                d="M140.06 260.6H337.15V329.41H140.06z"
              ></path>
              <path
                fill="url(#e)"
                d="M62.17 260.6H140.10000000000002V329.41H62.17z"
              ></path>
              <path
                style={{ isolation: "isolate" }}
                fill="#1f8efa"
                d="M411.49 34.05v43.8H41.1v-43.8a9 9 0 018.95-9h352.49a9 9 0 018.95 9z"
                opacity="0.18"
                transform="translate(-4.89 -12.78)"
              ></path>
              <rect
                width="141.48"
                height="13.04"
                x="194.46"
                y="248.88"
                fill="#1f8efa"
                rx="6.52"
                transform="rotate(-180 262.75 249.005)"
              ></rect>
              <rect
                width="141.48"
                height="13.04"
                x="194.46"
                y="248.88"
                fill="url(#f)"
                rx="6.52"
                transform="rotate(-180 262.75 249.005)"
              ></rect>
              <path
                fill="#1f8efa"
                d="M245.51 261.93h98.57l26-65.93a5.8 5.8 0 00-5.39-7.92h-77.35A18.68 18.68 0 00270 199.9z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#1f8efa"
                d="M250.52 262h93.62l24.69-62.63a5.5 5.5 0 00-5.12-7.52h-73.46a17.73 17.73 0 00-16.5 11.22z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="url(#g)"
                d="M250.52 262h93.62l24.69-62.63a5.5 5.5 0 00-5.12-7.52h-73.46a17.73 17.73 0 00-16.5 11.22z"
                transform="translate(-4.89 -12.78)"
              ></path>
              <path
                fill="#fff"
                d="M213.02 154.61H351.62V162.41000000000003H213.02z"
                opacity="0.51"
              ></path>
              <path fill="#fff" d="M213.02 141.26H311.55V149.06H213.02z"></path>
              <path
                fill="#fff"
                d="M325.02 141.26H390.97999999999996V149.06H325.02z"
              ></path>
              <path fill="#fff" d="M289.34 91.88H390.75V98.81H289.34z"></path>
              <path
                fill="#fff"
                d="M268.1 104.19H376.59000000000003V111.12H268.1z"
                opacity="0.51"
              ></path>
              <path fill="#fff" d="M214.9 91.88H281.6V98.81H214.9z"></path>
              <path fill="#fff" d="M244.16 116.13H390.75V123.06H244.16z"></path>
              <path
                fill="#fff"
                d="M214.9 116.13H236.42000000000002V123.06H214.9z"
                opacity="0.51"
              ></path>
              <path
                fill="#fff"
                d="M293.99 128.44H390.75V135.37H293.99z"
                opacity="0.51"
              ></path>
              <path fill="#fff" d="M214.9 128.44H281.6V135.37H214.9z"></path>
              <path
                fill="#fff"
                d="M214.9 103.9H257.79V110.83000000000001H214.9z"
              ></path>
              <path
                fill="#fff"
                d="M252.25 68.55H353.65999999999997V75.47999999999999H252.25z"
              ></path>
              <path
                fill="#fff"
                d="M231.01 80.86H339.5V87.78999999999999H231.01z"
                opacity="0.51"
              ></path>
              <path
                fill="#fff"
                d="M177.82 68.55H244.51999999999998V75.47999999999999H177.82z"
              ></path>
              <path fill="#fff" d="M251.35 54.2H352.76V61.13H251.35z"></path>
              <path fill="#fff" d="M176.92 41.18H243.62V48.11H176.92z"></path>
              <path
                fill="#fff"
                d="M176.92 29.3H243.62V36.230000000000004H176.92z"
              ></path>
              <path
                fill="#fff"
                d="M177.82 80.57H220.70999999999998V87.5H177.82z"
              ></path>
            </svg>
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
          {this.state.courses > 0 && (
            <div className="Panel__coursesContainer">
              {courses.name.map((val, indx) => {
                return (
                  <Link to={"/course/" + val} key={indx}>
                    <div
                      className={
                        "courses__box " + courses.style[parseInt(indx)]
                      }
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
          )}
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
