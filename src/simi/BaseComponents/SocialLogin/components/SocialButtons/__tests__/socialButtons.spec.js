import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SocialButtons from '../socialButtons';
import { useSocButtons } from '../../../talons/useSocButtons';

jest.mock('../button', () => 'Button');
jest.mock('../../../talons/useSocButtons');
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
jest.mock('../../../context', () => {
  const useSocialLoginContext = jest.fn(() => {});

  return { useSocialLoginContext };
});

const buttons = [
  {
    label: 'Facebook',
    type: 'facebook'
  },
  {
    label: 'Instagram',
    type: 'instagram'
  },
  {
    label: 'LinkedIn',
    type: 'linkedin'
  },
  {
    label: 'Google',
    type: 'google'
  }
];

test('render empty', () => {
  useSocButtons.mockReturnValue({ visibleButtons: buttons });

  const tree = createTestInstance(<SocialButtons buttons={null} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render without show more btn', () => {
  useSocButtons.mockReturnValue({
    visibleButtons: buttons.slice(0, 2),
    isShowMoreBtn: false
  });

  const tree = createTestInstance(
    <SocialButtons buttons={buttons.slice(0, 2)} />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render with show more btn', () => {
  useSocButtons.mockReturnValue({
    visibleButtons: buttons,
    isShowMoreBtn: true
  });

  const tree = createTestInstance(<SocialButtons buttons={buttons} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render with error', () => {
  useSocButtons.mockReturnValue({
    visibleButtons: buttons,
    isShowMoreBtn: true,
    errors: {
      message: 'Error message'
    }
  });

  const tree = createTestInstance(<SocialButtons buttons={buttons} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
