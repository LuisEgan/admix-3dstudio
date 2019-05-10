import React from 'react';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';

import { Login } from '../../pages/login';

describe('With Enzyme', () => {
  it('App shows "Hello world!"', () => {
    const wrapper = shallow(<Login />);

    expect(wrapper.find('button').length).toEqual(1);
  });
});

describe('With Snapshot Testing', () => {
  it('App shows "Hello world!"', () => {
    const store = configureMockStore({});
    const component = renderer.create(
      <Provider store={store}>
        <Login />
      </Provider>,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
