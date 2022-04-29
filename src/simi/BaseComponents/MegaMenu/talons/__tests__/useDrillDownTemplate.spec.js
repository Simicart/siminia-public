import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useLazyQuery } from '@apollo/client';
import { useDrillDownTemplate } from '../useDrillDownTemplate';
import { useAmMegaMenuContext } from '../../context';

jest.mock('../../context', () => ({
  useAmMegaMenuContext: jest.fn()
}));

jest.mock('@apollo/client', () => {
  const apolloClient = jest.requireActual('@apollo/client');
  const useLazyQuery = jest.fn();

  return { ...apolloClient, useLazyQuery };
});

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

const mockConfig = {
  root_category_id: 2
};

const defaultProps = {
  categoryId: 2,
  updateCategories: jest.fn()
};

const mockRunQuery = jest.fn();

const mockCategoryData = {
  called: true,
  error: null,
  loading: false,
  data: {
    category: {
      id: 11,
      children: [
        {
          children_count: 1,
          id: 12
        }
      ]
    }
  }
};

const Component = props => {
  const talonProps = useDrillDownTemplate(props);

  return <i {...talonProps} />;
};

test('return correct tree first level', () => {
  useAmMegaMenuContext.mockReturnValue({
    allItems: mockItems,
    config: mockConfig
  });
  useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);

  const rendered = createTestInstance(<Component {...defaultProps} />);
  const talonProps = rendered.root.findByType('i').props;
  const { categories } = talonProps;
  expect(mockRunQuery).toHaveBeenCalledTimes(1);
  expect(categories).toHaveLength(1);
  expect(categories).toMatchSnapshot();
});

test('return correct tree second level', () => {
  useAmMegaMenuContext.mockReturnValue({
    allItems: mockItems,
    config: mockConfig
  });
  useLazyQuery.mockReturnValue([mockRunQuery, mockCategoryData]);

  const rendered = createTestInstance(
    <Component {...defaultProps} categoryId={11} />
  );
  const talonProps = rendered.root.findByType('i').props;
  const { categories } = talonProps;
  expect(categories).toHaveLength(2);
  expect(categories).toMatchSnapshot();
});
