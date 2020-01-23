import Register from "../components/Register/Register";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Test Register page", () => {
  test("site renders correctly", () => {
    const component = renderer.create(
      <Router>
        <Register />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("loading is false on default", () => {
    const wrapper = shallow(
      <Router>
        <Register />
      </Router>
    );
    const result = wrapper.find("Register").dive();
    expect(result.state("loading")).toBe(false);
  });

  test("when button is clicked on click function is called and loading equals true", () => {
    const wrapper = shallow(
      <Router>
        <Register />
      </Router>
    );

    const component = wrapper.find("Register").dive();
    const button = component.find("button");
    
    component.setState({ email: "test", password: "test" });
    button.simulate("click");

    expect(component.state("loading")).toBe(true)
  });

  test("unmount function works", () => {
    const wrapper = shallow(
      <Router>
        <Register />
      </Router>
    );
    const component = wrapper.find("Register").dive();
    const onUnmountSpy = jest.spyOn(component.instance(), "componentWillUnmount");

    component.instance().componentWillUnmount()
    expect(onUnmountSpy).toHaveBeenCalled()
  });
});
