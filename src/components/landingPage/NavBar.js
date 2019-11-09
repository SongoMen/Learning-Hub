import React, { useState } from "react";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../auth";

const NavBar = props => {
  const [logged, setUser] = useState(null);
  function userCheck() {
    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }
  userCheck();
  return (
    <div className="NavBar">
      <Link to="/">
        <div className="NavBar__logo">
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
      {typeof props.menu === "undefined" && (
        <div className="NavBar__menu">
          {!logged ? (
            <ul>
              <li>
                <Link to="/login" className="form-btn">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="form-btn">
                  Register
                </Link>
              </li>
            </ul>
          ) : (
            <Link to="/dashboard" className="form-btn">
              Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
