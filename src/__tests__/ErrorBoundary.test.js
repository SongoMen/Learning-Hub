import ErrorBoundary from "../ErrorBoundary"
import {mount} from "enzyme";

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
}
