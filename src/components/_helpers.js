import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./LandingPage/NavBar";
import firebase from "firebase/app";
import { ReactComponent as LogoSvg } from "../svgs/logo.svg";

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

export function Mask() {
  return (
    <div>
      <div className="mask"></div>
      <NavBar menu="1" />
    </div>
  );
}
export function Input(props) {
  const childRef = React.useRef(null);

  React.useEffect(() => {
    props.handleRef(childRef.current.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <input
      className="input"
      onChange={() => props.handleRef(childRef.current.value)}
      ref={childRef}
      type={props.type}
      name={props.name}
      required
    />
  );
}

export function lessonsRef(courseName) {
  return db
    .collection("courses")
    .doc(courseName)
    .collection("lessons")
    .orderBy("title", "asc")
    .get();
}
