import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SocialAccountsPage from '../socialAccountsPage';
import { useSocialAccountsPage } from '../../../talons/useSocialAccountsPage';

jest.mock('../linkedAccounts', () => 'LinkedAccounts');
jest.mock('../../SocialButtons', () => 'SocialButtons');
jest.mock('@magento/venia-ui/lib/components/Head', () => ({
  Title: () => 'Title'
}));
jest.mock('../../../talons/useSocialAccountsPage', () => {
  const useSocialAccountsPage = jest.fn(() => {});

  return { useSocialAccountsPage };
});
jest.mock('@magento/venia-ui/lib/components/ErrorView', () => 'ErrorView');
jest.mock('react-router-dom', () => {
  return {
    useHistory: jest.fn(() => ({ push: jest.fn() }))
  };
});
jest.mock('../../../context', () => {
  const useSocialLoginContext = jest.fn(() => {});

  return { useSocialLoginContext };
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

jest.mock('@magento/venia-ui/lib/components/LoadingIndicator', () => {
  return {
    fullPageLoadingIndicator: 'LoadingIndicator'
  };
});

test('render errorView', () => {
  useSocialAccountsPage.mockReturnValue({ isEnabled: false, buttons: null });

  const tree = createTestInstance(<SocialAccountsPage />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render loading', () => {
  useSocialAccountsPage.mockReturnValue({ isEnabled: true, loading: true });

  const tree = createTestInstance(<SocialAccountsPage />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render correct page', () => {
  useSocialAccountsPage.mockReturnValue({
    isEnabled: true,
    loading: false,
    buttons: [
      {
        label: 'Facebook',
        type: 'facebook'
      },
      {
        label: 'Instagram',
        type: 'instagram'
      }
    ]
  });

  const tree = createTestInstance(<SocialAccountsPage />);
  expect(tree.toJSON()).toMatchSnapshot();
});
