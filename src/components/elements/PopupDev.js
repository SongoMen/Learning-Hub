import React from "react";
import { connect } from "react-redux";
import { setPopupDev } from "../../actions/actionsPanel";
import firebase from "firebase/app";
import "firebase/firestore";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  setPopupDev: () => dispatch(setPopupDev(false))
});

class PopupDev extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      uploading: false,
      msg: "",
      img: false,
      imgSrc: ""
    };
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  newCourse() {
    firebase
      .firestore()
      .collection("courses")
      .doc(this.course.value)
      .set({
        name: this.course.value,
        style: this.style.value,
        svg: this.svg.value
      })
      .then(() => {
        window.location.reload(false);
      })
      .catch(() => {
        console.error(
          "%c%s",
          "color: white; background: red;padding: 3px 6px;border-radius: 5px",
          "Error"
        );
      });
  }

  render() {
    return (
      <div className="popup">
        <div className="popupbox">
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
            onClick={() => this.props.setPopupDev()}
          >
            <path d="M18 6L6 18" />
            <path d="M6 6L18 18" />
          </svg>
          <div className="popupDev__content">
            <div className="form-line">
              <label htmlFor="course">Course name</label>
              <input
                className="input"
                name="course"
                type="text"
                required
                ref={course => (this.course = course)}
              ></input>
            </div>
            <div className="form-line">
              <label htmlFor="course">Style name</label>
              <input
                className="input"
                name="Style"
                type="text"
                required
                ref={style => (this.style = style)}
              ></input>
            </div>
            <div className="form-line">
              <label htmlFor="course">SVG Icon</label>
              <input
                className="input"
                name="svg"
                type="text"
                required
                ref={svg => (this.svg = svg)}
              ></input>
            </div>
            <input
              type="button"
              className="form-btn"
              value="CREATE"
              onClick={() => {
                this.newCourse();
              }}
            ></input>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupDev);
