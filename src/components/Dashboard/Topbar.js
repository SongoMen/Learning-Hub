import React from "react";
import date from "date-and-time";
import { connect } from "react-redux";
import "firebase/firestore";
import firebase from "firebase/app";

import { changeRightBar } from "../../actions/actionsPanel";

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");

let status;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status))
});

let courses = {
  name: [],
  length: [],
  style: [],
  svg: []
};

class Topbar extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      isSearchActive: false
    };
    this.searchbar = React.createRef();
    this.searchbarText = React.createRef();
  }

  handleBarChange() {
    status = this.props.rightBar ? false : true;
    this.props.changeRightBar();
  }

  handleSearch() {
    let searchbarClass = this.searchbar.current.classList;
    if (searchbarClass.contains("active")) {
      searchbarClass.remove("active");
      if (this._isMounted) {
        this.setState({
          isSearchActive: false
        });
      }
    } else {
      searchbarClass.add("active");
      if (this._isMounted) {
        this.setState({
          isSearchActive: true
        });
      }
    }
  }

  fetchAllCourses(){
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
            courses.name.push(doc.data()["name"]);
            courses.style.push(doc.data()["style"]);
            courses.svg.push(doc.data()["svg"]);
            courses.length.push(doc.data()["length"]);
          });
        } else {
          if (this._isMounted) {
            this.setState({
              courses: 0
            });
          }
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="Topbar">
        <div className="Topbar__searchbar" ref={this.searchbar}>
          <input placeholder="Search for courses" type="text" className="Topbar__searchInput"></input>
        </div>
        <h3>{this.props.name}</h3>
        <div className="Topbar__time">
          <h4 className="Topbar__date">{formatDate}</h4>
          {!this.state.isSearchActive ? (
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
              onClick={() => this.handleSearch()}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21L16.65 16.65" />
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
              className="button first"
              viewBox="0 0 24 24"
              onClick={() => this.handleSearch()}
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          )}
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
              onClick={() => this.handleBarChange()}
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
              onClick={() => this.handleBarChange()}
            >
              <path d="M5 12L19 12" />
              <path d="M12 5L19 12 12 19" />
            </svg>
          )}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
