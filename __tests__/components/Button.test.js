import React from 'react';
import { shallow } from 'enzyme';

import Button from '../../components/Button';

describe('init', () => {
  it('should render & function correctly', () => {
    const onClick = jest.fn();

    const wrapper = shallow(
      <Button fullWidth isSubmit type="danger" onClick={onClick}>
        <span>blabla</span>
      </Button>,
    );

    const button = wrapper.find('button');
    const buttonText = wrapper.find('span');

    expect(button.exists()).toEqual(true);
    expect(buttonText.exists()).toEqual(true);
    expect(buttonText.text()).toEqual('blabla');
  });
});
