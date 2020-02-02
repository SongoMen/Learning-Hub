import PopupDev from "../components/DevPanel/PopupDev";
import renderer from "react-test-renderer";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { mount, shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "../store";
import { Provider } from "react-redux";

configure({ adapter: new Adapter() });

describe("Test Register page", () => {
  test("site renders correctly", () => {
    const component = renderer.create(
      <Provider store={configureStore()}>
        <PopupDev />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
