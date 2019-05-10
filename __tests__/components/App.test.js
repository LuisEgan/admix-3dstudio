import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import { AppWrapper } from '../../components/App';

describe('With Enzyme', () => {
  it('App shows "Hello world!"', () => {
    const app = shallow(<AppWrapper isLoggedIn={true} />);
    console.log(app.debug());

    expect(app.find('main').length).toEqual(1);
  });
});
