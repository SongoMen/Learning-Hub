import * as helpers from "../components/_helpers";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Test helpers", () => {
  test("input renders correctly and onchange works", () => {
    const mockCallBack = jest.fn();
    const component = mount(<helpers.Input handleRef={mockCallBack} />);
    const componentRender = renderer.create(<helpers.Input />);
    let tree = componentRender.toJSON();
    
    component.find("input").simulate("change");

    expect(mockCallBack.mock.calls.length).toEqual(1);
    expect(tree).toMatchSnapshot();
  });

  test("mask renders correctly", () => {
    const component = renderer.create(
      <Router>
        <helpers.Mask />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Logo renders correctly", () => {
    const component = renderer.create(
      <Router>
        <helpers.Logo />
      </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("lessonRef works", () => {
    expect(typeof helpers.lessonsRef("test")).toEqual("object");
  });
});
