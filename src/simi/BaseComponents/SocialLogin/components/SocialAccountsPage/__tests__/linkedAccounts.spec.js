import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import LinkedAccounts from '../linkedAccounts';

jest.mock('../LinkedAccount', () => 'LinkedAccount');
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
  const props = {
    accounts: null,
    handleUnlink: () => {},
    isDisabled: false
  };

  const tree = createTestInstance(<LinkedAccounts {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render list', () => {
  const props = {
    accounts: [
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
    handleUnlink: () => {},
    isDisabled: false
  };

  const tree = createTestInstance(<LinkedAccounts {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
