import React from "react";
import CourseWrapper from "../elements/CourseWrapper";
import Loader from "../elements/Loader";
import ErrorMessage from "../elements/ErrorMessage";
import PropTypes from "prop-types";

const More = ({coursesCounter, courses}) => {
  return (
    <div className="More">
      {coursesCounter === "" && <Loader />}
      {coursesCounter === "err" && <ErrorMessage link="false" />}
      {coursesCounter === 0 && (
        <h3 className="courses__error">No courses available.</h3>
      )}
      {coursesCounter > 0 && (
        <div className="More__content">
          <h3>More courses</h3>
          <div className="More__coursesContainer">
            {courses.name.map((val, indx) => (
              <CourseWrapper
                name={val}
                index={indx}
                style={courses.style[parseInt(indx)]}
                length={courses.length[parseInt(indx)]}
                svg={courses.svg[parseInt(indx)]}
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
