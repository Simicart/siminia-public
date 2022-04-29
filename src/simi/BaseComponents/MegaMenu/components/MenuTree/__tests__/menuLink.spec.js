import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import MenuLink from '../menuLink';

jest.mock('../toggleTrigger.js', () => 'ToggleTrigger');
jest.mock('@magento/venia-drivers', () => ({
  __esModule: true,
  Link: props => <mock-Link>{props.children}</mock-Link>
}));

const defaultProps = {
  id: 5,
  url: 'venia-bottoms.html',
  name: 'bottoms',
  label: 'Sale',
  label_text_color: '#fff',
  label_background_color: '#000',
  icon: '/icon.png',
  subCategories: [{ id: 3 }],
  toggleAction: jest.fn().mockName('toggleAction'),
  view: 'hamburger',
  level: 1,
  isOpen: false,
  isShowIcons: false,
  onNavigate: jest.fn().mockName('onNavigate')
};

test('renders correct link', () => {
  const tree = createTestInstance(<MenuLink {...defaultProps} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders without label', () => {
  const tree = createTestInstance(<MenuLink {...defaultProps} label={null} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders without toggle btn', () => {
  const tree = createTestInstance(
    <MenuLink {...defaultProps} subCategories={null} />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders without icon', () => {
  const tree = createTestInstance(<MenuLink {...defaultProps} icon={null} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
