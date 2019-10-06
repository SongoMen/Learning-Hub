import React from "react";

import { login } from "../auth";
import NavBar from "../LandingPage/NavBar";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: ""
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    e.preventDefault();
    login(this.email.value, this.password.value).catch(error => {
      this.setState({
        msg: "Wrong Email or password"
      });
    });
  }
  render() {
    return (
      <div className="Login">
        <NavBar />
        <div className="wrapper">
          <form>
            <span>Member Login</span>

            <div>
              <input
                className="input"
                type="text"
                name="email"
                placeholder="Email"
                required
                ref={email => (this.email = email)}
              />
            </div>

            <div data-validate="Password is required">
              <input
                className="input"
                type="password"
                name="pass"
                placeholder="Password"
                required
                ref={password => (this.password = password)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="form-btn"
                onClick={event => this.handleClick(event)}
              >
                Login
              </button>
            </div>

            <div className="text-center">
              <span className="txt1">Forgot</span>{" "}
              <a className="txt2" href="Register">
                Password ?
              </a>
            </div>

            <div className="text-center">
              <span className="txt2">
                Doesn't have an account ?
                <a className="txt2" href="Register">
                  {" "}
                  Register here
                </a>
              </span>
            </div>
            {this.state.msg !== "" ? <h3>{this.state.msg}</h3> : <div />}
          </form>
        </div>
      </div>
    );
  }
}
