import React from "react";
import {Link} from "react-router-dom";

import {login} from "../auth";
import Loader from "../elements/Loader";
import {Logo, Mask, Input} from "../_helpers";

export default class Login extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      msg: "",
      loading: false,
      password: "",
      email: "",
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleRefPassword = ref => {
    this.setState({
      password: ref,
    });
  };

  handleRefEmail = ref => {
    this.setState({
      email: ref,
    });
  };

  handleClick() {
    if (this.state.loading === false) {
      if (this._isMounted) {
        this.setState({
          loading: true,
        });
      }
      login(this.state.email, this.state.password)
        .then(() => {
          if (this._isMounted) {
            this.setState({
              loading: false,
            });
          }
        })
        .catch(() => {
          if (this._isMounted) {
            this.setState({
              msg: "Wrong Email or password",
              loading: false,
            });
          }
        });
    }
    return false;
  }

  handleKeyPress(target) {
    if (target.charCode === 13) {
      this.handleClick();
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
        <Mask />
        <div className="wrapper">
          <Logo class="NavBar__logo mobile" />
          <form className="form" onKeyPress={this.handleKeyPress}>
            <h1>Sign In</h1>
            <div className="form-line">
              <label htmlFor="email">Email</label>
              <Input
                className="email"
                type="text"
                name="email"
                handleRef={this.handleRefEmail}
              />
            </div>
            <br />
            <div className="form-line" data-validate="Password is required">
              <label htmlFor="pass">Password</label>
              <Input
                type="password"
                name="pass"
                handleRef={this.handleRefPassword}
              />
            </div>
            <br />
            <br />
            <div>
              <button
                type="button"
                className="form-btn"
                onClick={event => this.handleClick(event)}>
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
            Don't have an account?
            <Link to="register">
              <span className="redirect">&nbsp;Sign up</span>
            </Link>
          </h4>
        </div>
      </div>
    );
  }
}
