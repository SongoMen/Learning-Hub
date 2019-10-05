import React from "react";
import {Link} from "react-router-dom";

const NavBar = () => {
  return (
    <div className="NavBar">
      <div className="NavBar__logo">
        Name
      </div>
      <div className="NavBar__menu">
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>

        </ul>

      </div>
    </div>
  );
};

export default NavBar;
