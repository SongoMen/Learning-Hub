import React from "react";
import "firebase/firestore";
import firebase from "firebase/app";
import {connect} from "react-redux";
import parse from "html-react-parser";
import {Link} from "react-router-dom";
import ordinal from "ordinal";
import "firebase/firestore";
import humanizeDuration from "humanize-duration";
import date from "date-and-time";

import UserWelcome from "./UserWelcome";
import {changeRightBar} from "../../actions/actionsPanel";
import Loader from "../elements/Loader";
import Topbar from "../Dashboard/Topbar";
import ErrorMessage from "../elements/ErrorMessage";
import CourseWrapper from "../elements/CourseWrapper";

let status;

const now = new Date();

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
      ms: () => "ms",
    },
  },
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
  "Dec",
];

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status)),
});

const db = firebase.firestore();

let courses = {
  name: [],
  length: [],
  style: [],
  svg: [],
};

let stats = {
  date: [],
  time: [],
  styles: [],
  names: [],
  fullDates: [],
};

function QuickstartPanel(props) {
  return (
    <Link aria-label="Your last started course" to={props.url}>
      <div>
        <h5>QUICKSTART</h5>
        <div className="title">
          <span className="courseLogo">{parse(props.svg)}</span>
          <h3>{props.course}</h3>
          <h4>Lesson: {ordinal(parseInt(props.lastLesson))}</h4>
        </div>
      </div>
    </Link>
  );
}

class Panel extends React.Component {
  _isMounted = false;

  statCharts = () => {
    return stats.date.map((val, indx) => (
      <div className="Panel__day" key={indx}>
        <h6>{val}</h6>
        <div className="Panel__slider">
          {stats.time[parseInt(indx)] > 0 &&
            stats.styles.map((val2, indx2) => {
              if (
                (stats.fullDates[parseInt(indx)] ===
                  `${val2.split(" ")[0]} ${val2.split(" ")[1]} ${
                    val2.split(" ")[2]
                  }` ||
                  stats.fullDates[parseInt(indx)] ===
                    `${val2.split(" ")[1]} ${val2.split(" ")[2]} ${
                      val2.split(" ")[3]
                    }`) &&
                stats[stats.names[parseInt(indx2)]] > 0
              ) {
                let he =
                  (" ",
                  stats[stats.names[parseInt(indx2)]] / this.state.maxValue) *
                    100 +
                  "%";
                return (
                  <div
                    key={indx2}
                    className={"Panel__slider-active " + val2}
                    style={{
                      height: he,
                    }}></div>
                );
              } else return "";
            })}
        </div>
        <h6>
          {shortEnglishHumanizer(parseInt(stats.time[parseInt(indx)] * 1000), {
            largest: 2,
            round: true,
          })}
        </h6>
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
      lessonId: "",
    };
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
        courses.length = [];
        if (snapshot.docs.length > 0) {
          snapshot.forEach(doc => {
            i++;
            courses.name.push(doc.data()["name"]);
            courses.style.push(doc.data()["style"]);
            courses.svg.push(doc.data()["svg"]);
            courses.length.push(doc.data()["length"]);
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
        if (this._isMounted) {
          this.setState({
            courses: "err",
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
              svg: doc.data()["svg"],
            });
          });
        } else if (this._isMounted) {
          this.setState({
            lastLesson: "",
          });
        }
      })
      .then(() => {
        if (this._isMounted) {
          this.setState({
            lastLessonLoader: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
        if (this._isMounted) {
          this.setState({
            lastLessonLoader: false,
            lastLesson: "err",
          });
        }
      });
  }

  clearStatsArray() {
    stats.date = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    stats.time = [];
    stats.styles = [];
    stats.names = [];
    stats.fullDates = [];
  }

  getThisWeekDates() {
    const today = date.format(now, "DD MMM YYYY");
    let forward = 0;
    let backwards = 0;
    this.clearStatsArray();
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
    let lastDateY = new Date(
      date.format(now, "YYYY"),
      date.format(now, "M") - 1,
      0,
    ).getDate(); //TO SORT CORRECTLY WHILE TRANSITION BETWEEN ONE MONTH TO ANOTHER -- BACKWARDS
    let lastDate = parseInt(today.split(" ")[0]);
    let lastDate2 = parseInt(today.split(" ")[0]);
    let daysInMonth = new Date(
      date.format(now, "YYYY"),
      date.format(now, "M"),
      0,
    ).getDate();

    datesWeek.push(String(lastDate).length === 1 ? "0" + lastDate : lastDate);

    // MOVE BACKWARDS FROM CURRENT DATE

    while (backwards > 0) {
      if (lastDate <= 1) {
        datesWeek.push(-99 + " " + (lastDateY + 1 - 1));
        lastDateY--;
      } else if (String(lastDate2 - 1).length !== 1) {
        datesWeek.push(lastDate - 1);
      } else {
        datesWeek.push("0" + (lastDate - 1));
      }
      lastDate--;
      backwards--;
    }

    // MOVE FORWARD FROM CURRENT DATE

    while (forward > 0) {
      if (daysInMonth <= lastDate2 && String(lastDate2 + 1).length !== 1) {
        datesWeek.push("33 " + (lastDateX + 1));
        lastDateX++;
      } else if (String(lastDate2 + 1).length !== 1) {
        datesWeek.push(lastDate2 + 1);
      } else {
        datesWeek.push("0" + (lastDate2 + 1));
      }
      lastDate2++;
      forward--;
    }

    datesWeek.sort();

    let nextMonth = months[months.indexOf(date.format(now, "MMM")) + 1];
    let previousMonth = months[months.indexOf(date.format(now, "MMM")) - 1];

    for (let i = 0; i < datesWeek.length; i++) {
      let day = String(datesWeek[parseInt(i)]).split(" ")[1];
      let monthYear = date.format(now, "MMM YYYY");
      let month = date.format(now, "MMM");
      let year = date.format(now, "YYYY");

      if (String(datesWeek[parseInt(i)]).split(" ").length === 1) {
        this.getStats(`${datesWeek[parseInt(i)]} ${monthYear}`, i, false);
        stats.date[parseInt(i)] += ` ${datesWeek[parseInt(i)]} ${month}`;
      } else if (String(datesWeek[parseInt(i)]).split(" ")[0] !== "-99") {
        if (String(datesWeek[parseInt(i)]).split(" ").length > 1) {
          this.getStats(`${day} ${nextMonth} ${year}`, i, false);
          stats.date[parseInt(i)] += ` ${day} ${nextMonth}`;
        }
      } else if (String(datesWeek[parseInt(i)]).split(" ")[0] === "-99") {
        this.getStats(`${day} ${previousMonth} ${year}`, i, true);
        stats.date[parseInt(i)] += ` ${day} ${previousMonth}`;
      }
    }
  }

  getLastWeekDates() {
    let backwards = 0;
    backwards = 6;
    let datesWeek = [];
    let lastDate = stats.date[0].split(" ")[1] - 1;
    let lastDateY = new Date(
      date.format(now, "YYYY"),
      date.format(now, "M") - 1,
      0,
    ).getDate();
    this.clearStatsArray();
    let prevMonth = false;

    datesWeek.push(String(lastDate).length === 1 ? "0" + lastDate : lastDate);

    while (backwards > 0) {
      if (String(lastDate).length === 1 && lastDate > 1) {
        datesWeek.push("0" + (lastDate - 1));
      } else if (lastDate > 1) {
        datesWeek.push("0 " + (lastDate - 1));
      } else {
        lastDate = lastDateY + 1;
        prevMonth = true;
        datesWeek.push("0 " + (lastDate - 1));
      }
      lastDate--;
      backwards--;
    }
    datesWeek.sort();
    let previousMonth = months[months.indexOf(date.format(now, "MMM")) - 1];
    for (let i = 0; i < datesWeek.length; i++) {
      let day = String(datesWeek[parseInt(i)]).split(" ")[1];
      let monthYear = date.format(now, "MMM YYYY");
      let month = date.format(now, "MMM");

      if (String(datesWeek[parseInt(i)]).split(" ").length === 1) {
        this.getStats(`${datesWeek[parseInt(i)]} ${monthYear}`, i);
        stats.date[parseInt(i)] += ` ${datesWeek[parseInt(i)]} ${month}`;
      } else {
        if (prevMonth && day > 10) {
          this.getStats(`${day} ${previousMonth}`, i);
          stats.date[parseInt(i)] += ` ${day} ${previousMonth}`;
        } else {
          this.getStats(`${day} ${monthYear}`, i);
          stats.date[parseInt(i)] += ` ${day} ${month}`;
        }
      }
    }
  }

  getStats(date, i, nextMonth) {
    let user = firebase.auth().currentUser.uid;
    if (this._isMounted) this.setState({statsLoader: true});
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
          this.getCourseStyle(doc.id, date, nextMonth);
          if (doc.exists === true) {
            sum += doc.data()["time"];
            stats.names.push(`${date} ${doc.id}`);
            stats[`${date} ${doc.id}`] = doc.data()["time"];
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
              maxValue: Math.max(...stats.time),
            });
          }
        }, 700);
      });
  }

  getCourseStyle(name, date, nextMonth) {
    db.collection("courses")
      .doc(name)
      .get()
      .then(snapshot => {
        if (typeof snapshot.data() !== "undefined") {
          if (nextMonth)
            stats.styles.push(`-1 ${date} ${snapshot.data()["style"]}`);
          else stats.styles.push(`${date} ${snapshot.data()["style"]}`);
          stats.styles.sort();
        }
      });
  }

  changeWeek(event) {
    if (event.target.value === "Last week" && !this.state.lastWeek) {
      if (this._isMounted)
        this.setState({lastWeek: true, selectValue: "Last week"});
      this.getLastWeekDates();
    } else {
      if (this._isMounted)
        this.setState({lastWeek: false, selectValue: "This week"});
      this.getThisWeekDates();
    }
  }

  componentDidMount() {
    this._isMounted = true;
    let isOpen = this.props.rightBar ? "" : "active"; // adds class to control width of panel
    if (this._isMounted) {
      this.setState({
        width: isOpen,
      });
    }
    if (window.matchMedia("(max-width: 800px)").matches) {
      status = false;
      this.props.changeRightBar();
    }
    this.loadLastLesson();
    this.loadCourses();
    this.getThisWeekDates();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.rightBar !== this.props.rightBar) {
      let isOpen = this.props.rightBar ? "" : "active"; // adds class to control width of panel
      if (this._isMounted) {
        this.setState({
          width: isOpen,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    if (user.length > 13) {
      user = user.substring(0, 13) + "...";
    }
    return (
      <div className={`Panel ${this.state.width}`} id="Panel">
        <Topbar name="Dashboard" />
        <UserWelcome
          lastLessonLoader={this.state.lastLessonLoader}
          lastLesson={this.state.lastLesson}
          lastLessonNumber={this.state.lastLessonNumber}
          user={user}
        />
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
                  viewBox="0 0 24 24">
                  <path d="M5 3L19 12 5 21 5 3z" />
                </svg>
                <h4>
                  This is the quick start panel, it will be available when you
                  start course.
                </h4>
              </div>
            ) : this.state.lastLesson > 0 ? (
              <QuickstartPanel
                svg={this.state.svg}
                lastLesson={this.state.lastLessonNumber}
                course={this.state.lastLesson}
                url={`/course/ ${this.state.lastLesson}`}
              />
            ) : (
              <QuickstartPanel
                url={`/course/${this.state.lastLesson}/${this.state.lessonId}`}
                svg={this.state.svg}
                lastLesson={this.state.lastLessonNumber}
                course={this.state.lastLesson}
              />
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
                viewBox="0 0 24 24">
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
              <div className="title">
                <h5>TIME SPENT ON LEARNING</h5>
                <label htmlFor="select"></label>
                <select
                  name="select"
                  value={this.state.selectValue}
                  onChange={this.changeWeek.bind(this)}
                  className="Panel__selectWeek">
                  <option value="This week">This week</option>
                  <option value="Last week">Last week</option>
                </select>
              </div>
              <div className="Panel__chart">{this.statCharts()}</div>
            </div>
          )}
        </div>
        <div className="Panel__more">
          <h3>More courses</h3>
          {this.state.courses === "err" && <ErrorMessage link="false" />}
          {this.state.courses === 0 && (
            <h3 className="courses__error">No courses available.</h3>
          )}
          {this.state.courses > 0 && (
            <div className="Panel__coursesContainer">
              {courses.name.map((val, indx) => (
                <CourseWrapper
                  name={val}
                  index={indx}
                  style={courses.style[parseInt(indx)]}
                  length={courses.length[parseInt(indx)]}
                  svg={courses.svg[parseInt(indx)]}
                  key={indx}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Panel);
