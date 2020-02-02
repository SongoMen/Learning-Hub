import React from "react";
import ordinal from "ordinal";
import Loader from "../elements/Loader";

import {ReactComponent as WelcomeSvg} from "../../svgs/Welcome.svg";

const UserWelcome = props => {
  return (
    <div className="Panel__welcome">
      {!props.lastLessonLoader ? (
        props.lastLesson === "" ? (
          <div className="left">
            <h2> Welcome, {props.user}!</h2>
            <h4>
              Looks like you didn't do any lessons yet
              <br />
              maybe you should start?
            </h4>
          </div>
        ) : (
          <div className="left">
            <h2> Welcome back, {props.user}!</h2>
            <h4>
              Your latest course was <b>{props.lastLesson}.</b>
            </h4>
            {props.lastLessonNumber !== 0 ? (
              <h4>
                You ended up on {ordinal(parseInt(props.lastLessonNumber))}{" "}
                lesson.
              </h4>
            ) : (
              <h4>But you didn't complete any lesson.</h4>
            )}
          </div>
        )
      ) : (
        <Loader />
      )}
      {!props.lastLessonLoader && <WelcomeSvg />}
    </div>
  );
};
export default UserWelcome;
