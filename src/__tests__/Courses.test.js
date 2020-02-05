import Courses from "../components/Courses/Courses";
import renderer from "react-test-renderer";
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import {mount, shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import config from "../components/firebaseAuth";
import * as firebase from "firebase/app";

firebase.initializeApp(config);
configure({adapter: new Adapter()});

describe("Test courses page", () => {
  test("site renders correctly", () => {
    const component = renderer.create(
      <Router>
        <Courses />
      </Router>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
