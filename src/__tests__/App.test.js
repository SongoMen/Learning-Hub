import React from "react";
import App from "../components/App";
import renderer from "react-test-renderer";
import { shallow,configure,mount } from 'enzyme';
import { MemoryRouter, Redirect } from 'react-router';
import Adapter from "enzyme-adapter-react-16";

import {PublicRoute, PrivateRoute} from "../components/App.js"

configure({adapter: new Adapter()});

describe("App", () => {
  it("renders correctly", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("unmounting works", () => {
    const component = shallow(
      <App/>
    );
    const onUnmountSpy = jest.spyOn(
      component.instance(),
      "componentWillUnmount",
    );

    component.instance().componentWillUnmount();
    expect(onUnmountSpy).toHaveBeenCalled();
  });
  it('should render component if user has been authenticated', () => {
    const AComponent = () => <div>AComponent</div>;
    const props = { path: '/testpath', component: AComponent };

    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={[props.path]}>
        <PrivateRoute authed={true}  component={props}/>
      </MemoryRouter>,
    );

    expect(enzymeWrapper.exists(AComponent)).toBe(true);
  });
  it("should redirect if user authed",()=>{
    const AComponent = () => <div>AComponent</div>;
    const props = { path: '/testpath', component: AComponent };

    const enzymeWrapper = mount(
      <MemoryRouter initialEntries={[props.path]}>
        <PublicRoute authed={true} component={AComponent} />
      </MemoryRouter>,
    );
    const history: any = enzymeWrapper.find('Router').prop('history');
    expect(history.location.pathname).toBe('/dashboard');
  })

});
