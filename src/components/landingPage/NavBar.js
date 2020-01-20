import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { firebaseAuth } from "../auth";
import { Logo } from "../_helpers";

const NavBar = props => {
  let isMounted = "";
  const [logged, setUser] = useState(null);
  function userCheck() {
    firebaseAuth().onAuthStateChanged(user => {
      if (user && isMounted) {
        setUser(true);
      } else if (isMounted) {
        setUser(false);
      }
    });
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isMounted = true;
    if (isMounted) {
      userCheck();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <nav className="Nav-bar">
      <Logo class="Nav-bar__logo" />
      {typeof props.menu === "undefined" && (
        <div className="Nav-bar__menu">
          {!logged ? (
            <ul>
              <li>
                <Link to="/login" className="Nav-bar__link">
                  <button className="form-btn">Login</button>
                </Link>
              </li>
              <li>
                <Link to="/register" className="Nav-bar__link">
                  <button className="form-btn">Register</button>
                </Link>
              </li>
            </ul>
          ) : (
            <Link to="/dashboard" className="Nav-bar__link">
              <button className="form-btn">Dashboard</button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
