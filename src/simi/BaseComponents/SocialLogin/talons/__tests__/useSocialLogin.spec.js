import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useQuery } from '@apollo/client';
import { useSocialLogin } from '../useSocialLogin';

const log = jest.fn();

const Component = props => {
  const talonProps = useSocialLogin({ ...props });

  useEffect(() => {
    log(talonProps);
  }, [talonProps]);

  return <i {...talonProps} />;
};

const props = {};

jest.mock('@apollo/client', () => {
  const apolloClient = jest.requireActual('@apollo/client');
  const useQuery = jest.fn(() => ({
    called: false,
    data: null,
    loading: false
  }));
  return {
    ...apolloClient,
    useQuery
  };
});

const mockData = {
  amSocialLoginButtonConfig: [
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
  ]
};

const storeConfigResponse = {
  amsociallogin_general_button_position: 'top',
  amsociallogin_general_button_shape: 2,
  amsociallogin_general_custom_url: '/social-accounts',
  amsociallogin_general_enabled: true,
  amsociallogin_general_login_position: 'popup,checkout_cart',
  amsociallogin_general_popup_enabled: true,
  amsociallogin_general_redirect_type: 1,
  id: 1,
  __typename: 'StoreConfig'
};

test('it returns the proper shape', () => {
  // Arrange.
  useQuery
    .mockReturnValueOnce({
      data: {
        storeConfig: storeConfigResponse
      },
      error: null,
      loading: false
    })
    .mockReturnValueOnce({
      data: mockData,
      error: null,
      loading: false
    });

  // Act.
  createTestInstance(<Component {...props} />);

  // Assert.
  const talonProps = log.mock.calls[0][0];
  const actualKeys = Object.keys(talonProps);
  const expectedKeys = [
    'storeConfig',
    'buttons',
    'isEnabled',
    'buttonShape',
    'buttonPosition',
    'needRedirect',
    'redirectUrl',
    'errors',
    'handleErrors',
    'enabledModes'
  ];
  expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});

test('runs the success query', () => {
  // Arrange.
  useQuery
    .mockReturnValue({
      data: {
        storeConfig: storeConfigResponse
      },
      error: null,
      loading: false
    })
    .mockReturnValue({
      data: mockData,
      error: null,
      loading: false
    });

  // Act.
  createTestInstance(<Component {...props} />);

  // Assert.
  const rendered = createTestInstance(<Component />);
  const talonProps = rendered.root.findByType('i').props;
  const { buttons } = talonProps;
  expect(buttons).toHaveLength(2);
});
