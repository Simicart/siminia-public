import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import DrillDownTemplate from '../drillDownTemplate';
import { useDrillDownTemplate } from '../../../talons/useDrillDownTemplate';

jest.mock('../../MenuTree/menuLink', () => 'MenuLink');
jest.mock('../../../talons/useDrillDownTemplate');

const defaultProps = {
  categoryId: 2,
  onNavigate: jest.fn().mockName('onNavigate'),
  setCategoryId: jest.fn().mockName('setCategoryId'),
  updateCategories: jest.fn().mockName('updateCategories')
};

const items = [
  {
    name: 'Bottoms',
    id: 'category-node-11',
    url: 'venia-bottoms.html',
    parent_id: null,
    __typename: 'MenuCategoryItem'
  },
  {
    name: 'Pants & Shorts',
    id: 'category-node-12',
    url: 'venia-bottoms/venia-pants.html',
    parent_id: 'category-node-11'
  }
];

test('renders without data', () => {
  useDrillDownTemplate.mockReturnValue({});

  const tree = createTestInstance(<DrillDownTemplate {...defaultProps} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correct tree', () => {
  useDrillDownTemplate.mockReturnValue({ categories: items });

  const tree = createTestInstance(<DrillDownTemplate {...defaultProps} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
