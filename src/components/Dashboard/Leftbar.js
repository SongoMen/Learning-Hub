import React from "react";

class Leftbar extends React.Component {
    
  render() {
    return (
      <div className="Leftbar">
          <div className="Leftbar__logo">
              logo
          </div>
        <ul>
          <li className="active">
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
export default Leftbar;
