import Login from "../components/Login/Login";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Test Login page", () => {
  test("site renders correctly", () => {
    const component = renderer.create(
      <Router>
        <Login />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("loading is false on default", () => {

    const wrapper = shallow(
      <Router>
        <Login/>
      </Router>
    );

    expect(wrapper.find("Login").dive().state("loading")).toBe(false);
  });
});
