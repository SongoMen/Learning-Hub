import React from "react";
import { Link } from "react-router-dom";

import { login } from "../auth";
import Loader from "../elements/Loader";

export default class Login extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    if (this.state.loading === false) {
      if (this._isMounted) {
        this.setState({
          loading: true
        });
      }
      login(this.email.value, this.password.value)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              loading: false
            });
          }
        })
        .catch(error => {
          if (this._isMounted) {
            this.setState({
              msg: "Wrong Email or password",
              loading: false
            });
          }
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
      <div className="Login">
        <div className="mask"></div>
        <Link to="/">
          <div className="NavBar__logo">
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
        <div className="wrapper">
          <form className="form">
            <h1>Sign In</h1>

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
              <label htmlFor="pass">Password</label>
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
                type="submit"
                className="form-btn"
                onClick={event => this.handleClick(event)}
              >
                {this.state.loading ? <Loader /> : <span>SIGN IN</span>}
              </button>
            </div>
            {this.state.msg !== "" ? (
              <h5 className="msg">{this.state.msg}</h5>
            ) : (
              <div className="msg" />
            )}
            <br />
            <h4 className="underForm">Forgot your password?</h4>
          </form>
          <h4 className="underForm bottom">
            Don't have an account?{" "}
            <Link to="register">
              <span className="redirect">&nbsp;Sign up</span>
            </Link>
          </h4>
        </div>
      </div>
    );
  }
}
