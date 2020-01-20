import React from "react";
import { Link } from "react-router-dom";

import { ReactComponent as LogoSvg } from "../../svgs/logo.svg";

const LandingPage = () => {
  return (
    <section className="Banner">
      <LogoSvg />
      <h1>Platform to help you learn efficiently. Start now!</h1>
      <div className="Banner__buttons">
        <Link to="/login" className="Banner__link">
          <button className="form-btn">Login</button>
        </Link>
        <Link to="/register" className="Banner__link">
          <button className="form-btn">Register</button>
        </Link>
      </div>
    </section>
  );
};
export default LandingPage;
