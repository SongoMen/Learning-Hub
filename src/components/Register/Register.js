import React, { Component } from "react";
import { Link } from "react-router-dom";
import "firebase/firestore";
import { auth } from "../auth";
import Loader from "../elements/Loader";
import NavBar from "../LandingPage/NavBar";
import { MobileLogo } from "../_helpers";
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
          <MobileLogo />
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
            Already have an account?
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
