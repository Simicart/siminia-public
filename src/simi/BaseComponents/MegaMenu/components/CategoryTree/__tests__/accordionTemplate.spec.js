import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAccordionTemplate } from '../../../talons/useAccordionTemplate';
import AccordionTemplate from '../accordionTemplate';

jest.mock('../../MenuTree', () => 'MenuTree');
jest.mock('../../../talons/useAccordionTemplate');

test('renders without data', () => {
  useAccordionTemplate.mockReturnValue({});

  const tree = createTestInstance(<AccordionTemplate />);
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
  useAccordionTemplate.mockReturnValue({ menuTree: items });

  const tree = createTestInstance(<AccordionTemplate />);
  expect(tree.toJSON()).toMatchSnapshot();
});
