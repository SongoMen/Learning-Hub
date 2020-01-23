import CourseWrapper from "../components/elements/CourseWrapper";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("Test course wrapper component", () => {
  test("component renders correctly", () => {
    const component = renderer.create(
      <Router>
        <CourseWrapper svg="x"/>
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
