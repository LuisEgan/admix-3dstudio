import React from 'react';
import { Provider } from 'react-redux';
import { withRouter } from 'next/router';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';

import { Login } from '../../pages/login';

jest.mock('react-redux', () => ({
  connect: () => {
    return component => {
      return component;
    };
  },
}));

// jest.mock('next/router', () => ({
//   Router: {
//     push: () => component => component
//   },
//   withRouter: () => component => component
// }));

// jest.mock("next/router", () => {
//   return ({children}) => {
//     return children;
//   }
// });

Login = withRouter(Login);

describe('With Enzyme', () => {
  it('App shows "Hello world!"', () => {
    const wrapper = shallow(<Login />);

    expect(wrapper.find('button').length).toEqual(1);
  });
});

describe('With Snapshot Testing', () => {
  it('App shows "Hello world!"', () => {
    const store = configureMockStore({});
    const component = renderer.create(<Login />);

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
