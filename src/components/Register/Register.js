import React, { Component } from "react";
import { Link } from "react-router-dom";
import "firebase/firestore";
import { auth } from "../auth";
import Loader from "../elements/Loader";
import NavBar from "../LandingPage/NavBar";

class Register extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      loading: false
    };
    this.handleClickRegisterUser = this.handleClickRegisterUser.bind(this);
  }
  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  handleClickRegisterUser(e) {
    var re = /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this._isMounted) {
      this.setState({
        loading: true
      });
    }
    if (
      this.password.value.length > 6 &&
      re.test(String(this.email.value).toLowerCase()) &&
      this.state.loading !== true
    ) {
      localStorage.setItem("user", this.username.value);
      auth(this.email.value, this.password.value, this.username.value)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              loading: false,
              msg: "Register Successful"
            });
          }
        })
        .catch(() => {
          if (this._isMounted) {
            this.setState({
              msg: "Error",
              loading: false
            });
          }
        });
    }
    if (this.password.value.length < 6) {
      if (this._isMounted) {
        this.setState({
          msg: "Password must have at least 6 characters",
          loading: false
        });
      }
    }
    if (re.test(String(this.email.value).toLowerCase()) === false) {
      if (this._isMounted) {
        this.setState({
          msg: "wrong email adress",
          loading: false
        });
      }
    }
  }
  render() {
    return (
      <div className="Register">
        <div className="mask"></div>
        <NavBar menu="1" />
        <div className="wrapper">
          <Link to="/">
            <div className="NavBar__logo mobile">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="logo"
                viewBox="0 0 24 24"
              >
                <path d="M16.5 9.4L7.5 4.21"></path>
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                <path d="M3.27 6.96L12 12.01 20.73 6.96"></path>
                <path d="M12 22.08L12 12"></path>
              </svg>
              <h3>Learning Hub</h3>
            </div>
          </Link>
          <form className="form">
            <h1>Sign Up</h1>

            <div className="form-line">
              <label htmlFor="username">Username</label>

              <input
                className="input"
                type="text"
                name="username"
                required
                ref={username => (this.username = username)}
              />
            </div>
            <br />
            <div className="form-line">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="text"
                name="email"
                required
                ref={email => (this.email = email)}
              />
            </div>
            <br />
            <div className="form-line" data-validate="Password is required">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                type="password"
                name="pass"
                required
                ref={password => (this.password = password)}
              />
            </div>
            <br />
            <br />
            <div>
              <button
                type="button"
                className="form-btn"
                onClick={event =>
                  this.handleClickRegisterUser(event, this.props.role)
                }
              >
                {this.state.loading ? <Loader /> : <span>SIGNUP</span>}
              </button>
            </div>
          </form>
          <h4 className="underForm bottom">
            Already have an account?{" "}
            <Link to="login">
              <span className="redirect">&nbsp;Login</span>
            </Link>
          </h4>
        </div>
      </div>
    );
  }
}

export default Register;
