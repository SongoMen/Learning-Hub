import React from "react";
import firebase from "firebase/app";
import { logout } from "../auth";
import "firebase/firestore";
import Loader from "../elements/Loader";
import {SetPopup} from "../../actions/actionsPanel"
import { connect } from "react-redux";


const db = firebase.firestore();

const mapStateToProps = state => ({
    ...state
  });
  
  const mapDispatchToProps = dispatch => ({
    SetPopup: () => dispatch(SetPopup(true))
  });

class Rightbar extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      avatar: ""
    };
  }
  getUserInfo() {
    let user = firebase.auth().currentUser.uid;

    db.collection("users")
      .doc(user)
      .onSnapshot(
        function(doc) {
          console.log(doc);
          if (typeof doc.data() !== "undefined" && this._isMounted) {
            this.setState({
              avatar: doc.data()["avatar"]
            });
          }
        }.bind(this)
      );
  }

  uploadImage(){
    this.props.SetPopup()
    console.log(this.props.popup)
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserInfo();
  }

  render() {
    let user = firebase.auth().currentUser.displayName;
    let useruid = firebase.auth().currentUser.uid;
    return (
      <div className="Rightbar">
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
              <img
                alt={useruid}
                src={this.state.avatar}
              />{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                onClick={()=>this.uploadImage()}
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
    );
  }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Rightbar);
