import React from "react";
import { withRouter } from "react-router-dom";
class Leftbar extends React.Component {
  componentDidMount() {
    switch (this.props.location.pathname) {
      case "/dashboard":
        document.querySelector(".Leftbar ul li:nth-child(1)").classList =
          "active";
        break;
      default:
        return "";
    }
  }
  render() {
    return (
      <div className="Leftbar">
        <div className="Leftbar__logo"></div>
        <ul>
          <li>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="feather feather-layout"
              viewBox="0 0 24 24"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M3 9L21 9" />
              <path d="M9 21L9 9" />
            </svg>{" "}
            <h4>Dashboard</h4>
          </li>
        </ul>
      </div>
    );
  }
}
export default withRouter(Leftbar);
