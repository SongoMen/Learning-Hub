import ErrorMessage from "../components/elements/ErrorMessage";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("Test Error message component", () => {
  test("component renders correctly", () => {
    const component = renderer.create(
      <Router>
        <ErrorMessage />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
