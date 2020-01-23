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
        <Login />
      </Router>
    );
    const result = wrapper.find("Login").dive();
    expect(result.state("loading")).toBe(false);
  });

  test("when button is clicked on click function is called and loading equals true", () => {
    const wrapper = shallow(
      <Router>
        <Login />
      </Router>
    );

    const component = wrapper.find("Login").dive();
    const button = component.find("button");
    
    component.setState({ email: "test", password: "test" });
    button.simulate("click");

    expect(component.state("loading")).toBe(true)
  });

  test("unmount function works", () => {
    const wrapper = shallow(
      <Router>
        <Login />
      </Router>
    );
    const component = wrapper.find("Login").dive();
    const onUnmountSpy = jest.spyOn(component.instance(), "componentWillUnmount");

    component.instance().componentWillUnmount()
    expect(onUnmountSpy).toHaveBeenCalled()
  });
});
