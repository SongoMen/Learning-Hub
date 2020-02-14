import React from "react";
import {Link} from "react-router-dom";
import parse from "html-react-parser";
import PropTypes from "prop-types";

const CourseWrapper = ({index, style, length, name, svg}) => (
  <Link to={"/course/" + name}>
    <div className={"courses__box " + style}>
      {parse(svg)}
      <div className="courses__info">
        <h5>Total lessons: {length}</h5>
        <h4>{name}</h4>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="courses__arrow">
        <line x1="0" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </div>
  </Link>
);

CourseWrapper.propTypes = {
  index: PropTypes.number,
  name: PropTypes.string,
  style: PropTypes.string,
  length: PropTypes.number,
  svg: PropTypes.string,
};

export default CourseWrapper;
