import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import TopMenu from '../topMenu';
import { useTopMenu } from '../../../talons/useTopMenu';

jest.mock('../../../talons/useTopMenu');
jest.mock('../../MenuTree', () => 'MenuTree');

test('renders without data', () => {
  useTopMenu.mockReturnValue({ menuTree: null, isEnabled: false });

  const tree = createTestInstance(<TopMenu />);
  expect(tree.toJSON()).toMatchSnapshot();
});

const items = [
  {
    name: 'Bottoms',
    id: 'category-node-11',
    url: 'venia-bottoms.html',
    parent_id: null,
    width: null,
    column_count: null,
    content: '{{child_categories_content}}',
    has_active: false,
    is_active: false,
    is_category: true,
    is_parent_active: true,
    width_value: null,
    status: null,
    label: null,
    label_text_color: null,
    label_background_color: null,
    icon: '',
    submenu_type: 0,
    subcategories_position: 0,
    __typename: 'MenuCategoryItem'
  },
  {
    name: 'Pants & Shorts',
    id: 'category-node-12',
    url: 'venia-bottoms/venia-pants.html',
    parent_id: 'category-node-11',
    width: null,
    column_count: null,
    content: '{{child_categories_content}}',
    has_active: false,
    is_active: false,
    is_category: true,
    is_parent_active: true,
    width_value: null,
    status: null,
    label: null,
    label_text_color: null,
    label_background_color: null,
    icon: '',
    submenu_type: 0,
    subcategories_position: 0,
    __typename: 'MenuCategoryItem'
  }
];

test('renders with data', () => {
  useTopMenu.mockReturnValue({ menuTree: items, isEnabled: true });

  const tree = createTestInstance(<TopMenu />);
  expect(tree.toJSON()).toMatchSnapshot();
});
