import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SocialAuthentication from '../socialAuthentication';
import { useSocialLoginContext } from '../../../context';

const defaultTalons = {
  storeConfig: null,
  buttons: [
    {
      label: 'Facebook',
      type: 'facebook',
      url:
        'https://ce241-pwa--atakarski.ap74.corp.amdev.by/amsociallogin/social/login/?type=facebook'
    },
    {
      label: 'Instagram',
      type: 'instagram',
      url:
        'https://ce241-pwa--atakarski.ap74.corp.amdev.by/amsociallogin/social/login/?type=instagram'
    }
  ],
  isEnabled: true,
  buttonShape: 'round',
  buttonPosition: 'top',
  needRedirect: false,
  errors: null,
  handleErrors: jest.fn(),
  enabledModes: 'popup,checkout_cart'
};

jest.mock('../../../context', () => {
  const useSocialLoginContext = jest.fn(() => {});

  return { useSocialLoginContext };
});
jest.mock('@magento/peregrine/lib/context/user', () => {
  const userState = {
    isGettingDetails: false,
    getDetailsError: null
  };
  const userApi = {
    getUserDetails: jest.fn(),
    setToken: jest.fn(),
    signIn: jest.fn()
  };
  const useUserContext = jest.fn(() => [userState, userApi]);

  return { useUserContext };
});
jest.mock('react-intl', () => ({
  FormattedMessage: props => (
    <div componentName="Formatted Message Component" {...props} />
  ),
  useIntl: jest.fn().mockReturnValue({
    formatMessage: jest
      .fn()
      .mockImplementation(options => options.defaultMessage)
  })
}));

test('render empty', () => {
  useSocialLoginContext.mockReturnValue({ isEnabled: false, buttons: null });

  const tree = createTestInstance(<SocialAuthentication />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render disabled mode', () => {
  useSocialLoginContext.mockReturnValue(defaultTalons);

  const tree = createTestInstance(<SocialAuthentication mode="register" />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render in popup', () => {
  useSocialLoginContext.mockReturnValue(defaultTalons);

  const tree = createTestInstance(<SocialAuthentication mode="popup" />);
  expect(tree.toJSON()).toMatchSnapshot();
});
