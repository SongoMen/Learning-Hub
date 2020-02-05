import ErrorBoundary from "../ErrorBoundary"
import {mount,configure} from "enzyme";
import React from 'react';
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

const Something = () => null;

describe('ErrorBoundary', () => {
  it('should display an ErrorMessage if wrapped component throws', () => {
    const wrapper = mount(
      <ErrorBoundary>
        <Something />
      </ErrorBoundary>
    );

    const error = new Error('test');

    wrapper.find(Something).simulateError(error);
  })
})
