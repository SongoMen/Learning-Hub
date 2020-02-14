import React from "react";
import ordinal from "ordinal";
import PropTypes from "prop-types";

import Loader from "../elements/Loader";
import {ReactComponent as WelcomeSvg} from "../../svgs/Welcome.svg";

const UserWelcome = ({
  user,
  lastLessonNumber,
  lastLesson,
  lastLessonLoader,
}) => (
  <div className="Welcome">
    {!lastLessonLoader ? (
      lastLesson === "" ? (
        <div className="Welcome__left">
          <h2> Welcome, {user}!</h2>
          <h4>
            Looks like you didn't do any lessons yet
            <br />
            maybe you should start?
          </h4>
        </div>
      ) : (
        <div className="Welcome__left">
          <h2> Welcome back, {user}!</h2>
          <h4>
            Your latest course was <b>{lastLesson}.</b>
          </h4>
          {lastLessonNumber !== 0 ? (
            <h4>
              You ended up on {ordinal(parseInt(lastLessonNumber))} lesson.
            </h4>
          ) : (
            <h4>But you didn't complete any lesson.</h4>
          )}
        </div>
      )
    ) : (
      <Loader />
    )}
    {!lastLessonLoader && <WelcomeSvg />}
  </div>
);

UserWelcome.propTypes = {
  user: PropTypes.string,
  lastLesson: PropTypes.string,
  lastLessonNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lastLessonLoader: PropTypes.bool,
};

export default UserWelcome;
