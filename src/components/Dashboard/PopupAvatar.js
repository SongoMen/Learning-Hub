import React from "react";
import { connect } from "react-redux";
import firebase from "firebase/app";
import "firebase/storage";

import {setPopup} from "../../actions/actionsPanel";

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  setPopup: () => dispatch(setPopup(false)),
});

class PopupAvatar extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      uploading: false,
      msg: "",
      img: false,
      imgSrc: "",
    };
    this.file = React.createRef();
    this.preview = React.createRef();
  }

  upload() {
    if (this._isMounted && this.state.uploading === false) {
      let user = firebase.auth().currentUser.uid;
      var storageRef = firebase.storage().ref(user);
      var file = this.file.current.files[0];

      storageRef.put(file).then(function() {
        window.location.reload(false);
      });
    }
  }

  showPreview() {
    var reader = new FileReader();
    reader.onload = function(e) {
      this.preview.current.src = e.target.result;
    };
    reader.readAsDataURL(this.file.current.files[0]);
    if (this._isMounted) {
      this.setState({
        img: true,
      });
    }
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
            onClick={() => this.props.setPopup()}>
            <path d="M18 6L6 18" />
            <path d="M6 6L18 18" />
          </svg>
          <div className="popupbox__content">
            <input
              type="file"
              id="file"
              ref={this.file}
              onChange={() => {
                this.showPreview();
              }}
              accept="image/jpeg, image/png"></input>
            <div
              className="upload"
              onClick={() => {
                this.file.current.click();
              }}>
              {this.state.img === false ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="feather feather-file-plus"
                  viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2L14 8 20 8" />
                  <path d="M12 18L12 12" />
                  <path d="M9 15L15 15" />
                </svg>
              ) : (
                <img
                  alt="preview"
                  className="preview"
                  ref={this.preview}
                  id="preview"></img>
              )}
            </div>
            <h3>Upload profile picture</h3>
            <button
              type="button"
              onClick={() => {
                this.upload();
              }}
              className="form-btn">
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopupAvatar);
