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

class DevPanel extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      width: "68%",
      courses: ""
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
    let user = firebase.auth().currentUser.uid;
    firebase
      .firestore()
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
              courses: 0
            });
          }
        }
      })
      .catch(() => {
        this.setState({
          courses: "err"
        });
      });
  }
  componentDidMount() {
    this._isMounted = true;
    this.loadAllCourses()
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

  render() {
    return (
      <div
        style={{ width: this.state.width }}
        className="DevPanel"
        id="DevPanel"
      >
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
        {this.state.courses === 0 && (
          <div className="DevPanel__list">
            <h3>No courses available</h3>
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DevPanel);
