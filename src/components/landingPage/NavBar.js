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
      } else if(isMounted){
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
    <div className="NavBar">
      <Logo class="NavBar__logo" />
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
