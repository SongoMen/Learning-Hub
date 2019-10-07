import React from "react";
import firebase from "firebase/app";
import "firebase/storage";
import { logout } from "../auth";
import "firebase/firestore";
import Loader from "../elements/Loader";
import { SetPopupAvatar } from "../../actions/actionsPanel";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  SetPopupAvatar: () => dispatch(SetPopupAvatar(true))
});

class Rightbar extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      avatar: "",
      show: false
    };
  }
  getUserInfo() {
    let user = firebase.auth().currentUser.uid;
    firebase
      .storage()
      .ref(user)
      .getDownloadURL()
      .then(
        function(url) {
          if (this._isMounted) {
            this.setState({
              avatar: url
            });
          }
        }.bind(this)
      )
      .catch(() => {
        if (this._isMounted) {
          this.setState({
            avatar:
              "https://firebasestorage.googleapis.com/v0/b/learning-a4a51.appspot.com/o/download.png?alt=media&token=7053ef8a-57ad-4ec8-accf-1c10becd0195"
          });
        }
      });
  }

  uploadImage() {
    this.props.SetPopupAvatar();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserInfo();
    setTimeout(() => {
      this.setState({
        show: true
      });
    }, 300);
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    let useruid = firebase.auth().currentUser.uid;
    return (
      <div className="Rightbar" id="RightBar">
        {this.state.show && (
          <div>
            <div className="Rightbar__logout">
              <h4>Logout</h4>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                onClick={() => logout()}
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <path d="M16 17L21 12 16 7" />
                <path d="M21 12L9 12" />
              </svg>
            </div>
            <div className="Rightbar__user">
              {this.state.avatar !== "" ? (
                <div className="Rightbar__image">
                  <img alt={useruid} src={this.state.avatar} />{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    onClick={() => this.uploadImage()}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5L12 19" />
                    <path d="M5 12L19 12" />
                  </svg>
                </div>
              ) : (
                <Loader />
              )}
              <h3>{user}</h3>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rightbar);
