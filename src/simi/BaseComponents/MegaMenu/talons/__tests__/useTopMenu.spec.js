import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useTopMenu } from '../useTopMenu';
import { useAmMegaMenuContext } from '../../context';

jest.mock('../../context', () => ({
  useAmMegaMenuContext: jest.fn()
}));

const Component = () => {
  const talonProps = useTopMenu();

  return <i {...talonProps} />;
};

const mockItems = [
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

test('return correct tree', () => {
  useAmMegaMenuContext.mockReturnValue({ allItems: mockItems, config: {} });

  const rendered = createTestInstance(<Component />);
  const talonProps = rendered.root.findByType('i').props;
  const { menuTree } = talonProps;
  expect(menuTree).toHaveLength(1);
});
