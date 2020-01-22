import * as helpers from "../components/_helpers";
import * as actions from "../actions/actionsPanel";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("Test helpers", () => {
  test("input renders correctly", () => {
    const component = renderer.create(<Router><helpers.Input/></Router>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
