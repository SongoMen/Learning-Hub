import React from "react";
import CourseWrapper from "../elements/CourseWrapper";
import Loader from "../elements/Loader";
import ErrorMessage from "../elements/ErrorMessage";
import PropTypes from "prop-types";

const More = props => {
  return (
    <div className="More">
      {props.coursesCounter === "" && <Loader />}
      {props.coursesCounter === "err" && <ErrorMessage link="false" />}
      {props.coursesCounter === 0 && (
        <h3 className="courses__error">No courses available.</h3>
      )}
      {props.coursesCounter > 0 && (
        <div className="More__content">
          <h3>More courses</h3>
          <div className="More__coursesContainer">
            {props.courses.name.map((val, indx) => (
              <CourseWrapper
                name={val}
                index={indx}
                style={props.courses.style[parseInt(indx)]}
                length={props.courses.length[parseInt(indx)]}
                svg={props.courses.svg[parseInt(indx)]}
                key={indx}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

More.propTypes = {
  coursesCounter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  courses: PropTypes.object,
};

export default More;
