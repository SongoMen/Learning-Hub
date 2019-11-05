import React from "react";
import date from "date-and-time";
import { connect } from "react-redux";
import { changeRightBar } from "../../actions/actionsPanel";

const now = new Date();
const formatDate = date.format(now, "DD MMM YYYY, dddd");

let status;

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeRightBar: () => dispatch(changeRightBar(status))
});

class TopPanel extends React.Component {
  rightBarChange() {
    status = this.props.rightBar ? false : true;
    this.props.changeRightBar();
  }
  render() {
    return (
      <div className="Panel__title">
        <h3>{this.props.name}</h3>
        <div className="Panel__time">
          <h4 className="Panel__date">{formatDate}</h4>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="button first"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21L16.65 16.65" />
          </svg>
          {this.props.rightBar ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="button"
              viewBox="0 0 24 24"
              onClick={() => this.rightBarChange()}
            >
              <path d="M5 12L19 12" />
              <path d="M12 5L19 12 12 19" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="button backwards"
              viewBox="0 0 24 24"
              onClick={() => this.rightBarChange()}
            >
              <path d="M5 12L19 12" />
              <path d="M12 5L19 12 12 19" />
            </svg>
          )}
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopPanel);