import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAmMegaMenuContext } from '../../../context';
import CategoryTree from '../categoryTree';

jest.mock(
  '@magento/venia-ui/lib/components/CategoryTree/categoryTree',
  () => 'DefaultTemplate'
);
jest.mock('../drillDownTemplate.js', () => 'DrillDownTemplate');
jest.mock('../accordionTemplate.js', () => 'AccordionTemplate');
jest.mock('../../../context', () => ({
  useAmMegaMenuContext: jest.fn().mockName('useAmMegaMenuContext')
}));

test('renders without data', () => {
  useAmMegaMenuContext.mockReturnValue({});

  const tree = createTestInstance(<CategoryTree />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders default template', () => {
  useAmMegaMenuContext.mockReturnValue({ isEnabledMegaMenu: false });

  const tree = createTestInstance(<CategoryTree />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders drill template', () => {
  useAmMegaMenuContext.mockReturnValue({
    isEnabledMegaMenu: true,
    hamburgerView: 'drill',
    isMobile: true
  });

  const tree = createTestInstance(<CategoryTree />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders accordion template', () => {
  useAmMegaMenuContext.mockReturnValue({
    isEnabledMegaMenu: true,
    hamburgerView: 'accordion'
  });

  const tree = createTestInstance(<CategoryTree />);
  expect(tree.toJSON()).toMatchSnapshot();
});
