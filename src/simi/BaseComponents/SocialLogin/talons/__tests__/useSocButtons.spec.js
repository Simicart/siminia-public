import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useSocButtons } from '../useSocButtons';

const log = jest.fn();
const props = {};

jest.mock('@magento/peregrine/lib/context/user', () => {
  const state = {
    isSignedIn: true
  };
  const api = {};
  const useUserContext = jest.fn(() => [state, api]);

  return { useUserContext };
});

jest.mock('../../context', () => {
  const useSocialLoginContext = jest.fn(() => ({
    buttonShape: '',
    errors: null,
    handleErrors: jest.fn()
  }));

  return { useSocialLoginContext };
});

const Component = props => {
  const talonProps = useSocButtons({ ...props });

  useEffect(() => {
    log(talonProps);
  }, [talonProps]);

  return <i {...talonProps} />;
};

test('it returns the proper shape', () => {
  // Act.
  createTestInstance(<Component {...props} />);

  // Assert.
  const talonProps = log.mock.calls[0][0];
  const actualKeys = Object.keys(talonProps);
  const expectedKeys = [
    'handleLogin',
    'visibleButtons',
    'isShowMoreBtn',
    'handleShowMore',
    'buttonShape',
    'errors',
    'errorRef'
  ];
  expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});
