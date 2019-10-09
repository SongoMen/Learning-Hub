import React from "react";
import ReactDOM from "react-dom";
import App from "../components/App";
import renderer from "react-test-renderer";

describe("App", () => {
  test("renders", () => {
    const component = renderer.create(<App/>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
