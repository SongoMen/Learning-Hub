import React from "react";
import date from "date-and-time";
import "firebase/firestore";
import firebase from "firebase/app";
import { changeRightBar } from "../../actions/actionsPanel";
import { connect } from "react-redux";
import Loader from "../elements/Loader";

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");
let status;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status))
});

class Panel extends React.Component {
  constructor() {
    super();
    this.state = {
      lastLesson: "",
      lastLessonLoader: true
    };
  }
  _isMounted = false;
  rightBarChange() {
    status = this.props.rightBar ? false : true;
    this.props.changeRightBar();
  }

  loadLastLesson() {
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
              lastLesson: ""
            });
          }
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
        this.setState({
          lastLessonLoader: false,
          lastLesson: "err"
        });
      });
  }
  componentDidMount() {
    this._isMounted = true;
    this.loadLastLesson();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    return (
      <div className="Panel" id="Panel">
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
        {this.state.lastLesson === "" && (
          <div className="Panel__welcome">
            <div className="left">
              <h2> Welcome, {user}!</h2>
              <h4>
                Looks like you didn't do any lessons yet
                <br />
                maybe you should start?
              </h4>
            </div>
          </div>
        )}
        <div className="Panel__quickstart">
          {this.state.lastLessonLoader ? (
            <Loader />
          ) : this.state.lastLesson !== "err" ? (
            this.state.lastLesson === "" && (
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
                This is the quick start panel, from here you will be able to quickly come back to last lesson but for now click here to begin lessons.
                </h4>
              </div>
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
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Panel);
