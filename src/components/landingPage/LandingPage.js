import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as LogoSvg } from "../../svgs/logo.svg";
import NavBar from "./NavBar";

const LandingPage = () => {
  return (
    <div className="Landing-page">
      <NavBar />
      <section className="Landing-page__banner">
        <LogoSvg />
        <h1>Platform to help you learn efficiently. Start now!</h1>
        <div className="Landing-page__buttons">
          <Link to="/login" className="Landing-page__link">
            <button className="form-btn">Login</button>
          </Link>
          <Link to="/register" className="Landing-page__link">
            <button className="form-btn">Register</button>
          </Link>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
