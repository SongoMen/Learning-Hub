import React from "react";
import {Link} from "react-router-dom";

const ErrorMessage = props => {
  return (
    <div className="CoursePage__error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
        <path d="M9 9L9.01 9" />
        <path d="M15 9L15.01 9" />
      </svg>
      <h1>ERROR</h1>
      {typeof props.link === "undefined" && (
        <Link to="/dashboard">
          <h4>Go back to dashboard</h4>
        </Link>
      )}
    </div>
  );
};
export default ErrorMessage;
