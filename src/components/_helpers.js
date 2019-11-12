import React from "react";
import { Link } from "react-router-dom";
import NavBar from "./LandingPage/NavBar";
import firebase from "firebase/app";

export function Logo(props) {
  return (
    <Link to={typeof props.link === "undefined" ? "/" : ""}>
      <div className={props.class}>
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

const db = firebase.firestore();

export function lessonsRef(courseName) {
  return db
    .collection("courses")
    .doc(courseName)
    .collection("lessons")
    .orderBy("title", "asc")
    .get();
}
