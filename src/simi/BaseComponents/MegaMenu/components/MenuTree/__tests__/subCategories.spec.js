import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SubCategories from '../subCategories';

jest.mock('../../MenuTree/menuItem', () => 'MenuItem');

test('renders without data', () => {
  const tree = createTestInstance(<SubCategories />);
  expect(tree.toJSON()).toMatchSnapshot();
});

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

test('renders correct tree', () => {
  const tree = createTestInstance(<SubCategories items={items} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
