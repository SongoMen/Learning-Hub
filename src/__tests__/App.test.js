import React from "react";
import App from "../components/App";
import renderer from "react-test-renderer";

describe("App", () => {
  it("renders correctly", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("unmounting works", () => {
    const component = renderer.create(
      <App/>
    );
    const onUnmountSpy = jest.spyOn(
      component.instance(),
      "componentWillUnmount",
    );

    component.instance().componentWillUnmount();
    expect(onUnmountSpy).toHaveBeenCalled();
  });
});
