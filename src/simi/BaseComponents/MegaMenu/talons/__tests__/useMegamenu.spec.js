import React, { useEffect } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useQuery } from '@apollo/client';
import { useMegaMenu } from '../useMegaMenu';

const log = jest.fn();

const Component = props => {
  const talonProps = useMegaMenu({ ...props });

  useEffect(() => {
    log(talonProps);
  }, [talonProps]);

  return <i {...talonProps} />;
};

const props = {};

const storeConfigResponse = {
  id: 1,
  ammegamenu_general_enabled: true,
  ammegamenu_general_show_icons: false,
  ammegamenu_general_hamburger_enabled: false
};

jest.mock('@magento/peregrine/lib/hooks/useWindowSize', () => {
  const actual = jest.requireActual(
    '@magento/peregrine/lib/hooks/useWindowSize'
  );
  const useWindowSize = jest.fn().mockReturnValue({
    innerWidth: 1025
  });

  return {
    ...actual,
    useWindowSize
  };
});

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
      data: {
        amMegaMenuAll: {
          items: []
        }
      },
      error: null,
      loading: false
    });

  // Act.
  createTestInstance(<Component {...props} />);

  // Assert.
  const talonProps = log.mock.calls[0][0];
  const actualKeys = Object.keys(talonProps);
  const expectedKeys = [
    'loading',
    'error',
    'isEnabledMegaMenu',
    'isMobile',
    'hamburgerView',
    'isShowIcons',
    'config',
    'allItems',
    'amRootStyle'
  ];
  expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});

test('items is null when data is falsy', () => {
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
      data: null,
      error: null,
      loading: false
    });

  // Act.
  createTestInstance(<Component {...props} />);

  // Assert.
  const rendered = createTestInstance(<Component />);
  const talonProps = rendered.root.findByType('i').props;
  const { allItems } = talonProps;
  expect(allItems).toBeUndefined();
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
      data: {
        amMegaMenuAll: {
          items: [
            {
              id: 3,
              name: 'Bottoms',
              url: 'bottoms.html'
            }
          ]
        }
      },
      error: null,
      loading: false
    });

  // Act.
  createTestInstance(<Component {...props} />);

  // Assert.
  const rendered = createTestInstance(<Component />);
  const talonProps = rendered.root.findByType('i').props;
  const { allItems } = talonProps;
  expect(allItems).toHaveLength(1);
});
