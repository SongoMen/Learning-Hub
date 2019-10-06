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
      loading: ""
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
        <div className="NavBar__logo">Name</div>{" "}
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
