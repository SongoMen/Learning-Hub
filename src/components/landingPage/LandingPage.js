import React from "react";
import { Link } from "react-router-dom";

import NavBar from "./NavBar";

const LandingPage = () => {
  return (
    <div className="Landing-page">
      <NavBar />
      <section className="Landing-page__banner">
        <h1>Platform to help you learn efficiently. Start now!</h1>
        <div className="Landing-page__buttons">
          <Link to="/login" className="form-btn">
            Login
          </Link>
          <Link to="/register" className="form-btn">
            Register
          </Link>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
