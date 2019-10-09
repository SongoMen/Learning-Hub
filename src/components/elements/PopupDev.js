import React from "react";
import { connect } from "react-redux";
import { setPopupDev } from "../../actions/actionsPanel";
import firebase from "firebase/app";
import "firebase/storage";

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
          <div className="popupDev__content"></div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupDev);
