import React from "react";
import {Link} from "react-router-dom";
import NavBar from "./LandingPage/NavBar";
import firebase from "firebase/app";
import PropTypes from "prop-types";

import {ReactComponent as LogoSvg} from "../svgs/logo.svg";

const db = firebase.firestore();

export function Logo(props) {
  return (
    <Link to={typeof props.link === "undefined" ? "/" : "/dashboard"}>
      <div className={props.class}>
        <LogoSvg />
        <h3>Learning Hub</h3>
      </div>
    </Link>
  );
}

Logo.propTypes = {
  class: PropTypes.string,
  link: PropTypes.string
}

export function Mask() {
  return (
    <div>
      <div className="mask"></div>
      <NavBar menu="1" />
    </div>
  );
}

export function Input(props) {
  const childRef = React.useRef();
  return (
    <input
      className="input"
      ref={childRef}
      type={props.type}
      name={props.name}
      required
      onChange={() => props.handleRef(childRef.current.value)}
    />
  );
}

Input.propTypes = {
  name: PropTypes.string,
  handleRef: PropTypes.func,
  type: PropTypes.string,
};

export function lessonsRef(courseName) {
  return db
    .collection("courses")
    .doc(courseName)
    .collection("lessons")
    .orderBy("title", "asc")
    .get();
}
