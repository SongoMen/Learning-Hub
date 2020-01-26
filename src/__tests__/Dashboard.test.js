import Dashboard from "../components/Dashboard/Dashboard";
import renderer from "react-test-renderer";
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {mount, shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "../store";
import {Provider} from "react-redux";

configure({adapter: new Adapter()});

describe("Test Dashboard page", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => {
        return {matches: true};
      }),
    });
  });
  test("site renders correctly", () => {
    const component = renderer.create(
      <Router>
        <Provider store={configureStore()}>
          <Dashboard />
        </Provider>
      </Router>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
