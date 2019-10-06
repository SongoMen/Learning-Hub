import React from "react";
import { connect } from "react-redux";
import { SetPopupAvatar } from "../../actions/actionsPanel";
import firebase from "firebase/app";
import "firebase/storage";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  SetPopupAvatar: () => dispatch(SetPopupAvatar(false))
});

class PopupAvatar extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      uploading: false,
      msg:""
    };
  }

  upload() {
    if (this._isMounted && this.state.uploading === false) {

      let user = firebase.auth().currentUser.uid;
      var storageRef = firebase.storage().ref(user);
      var file = document.getElementById("file").files[0];

      console.log(file);
      storageRef.put(file).then(function(snapshot) {
        window.location.reload(false);
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
            onClick={() => this.props.SetPopupAvatar()}
          >
            <path d="M18 6L6 18" />
            <path d="M6 6L18 18" />
          </svg>
          <h3>Upload profile picture</h3>
          <input type="file" id="file" accept="image/jpeg, image/png"></input>
          <button
            type="button"
            onClick={() => {
              this.upload();
            }}
            className="form-btn"
          >
            xx
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupAvatar);
