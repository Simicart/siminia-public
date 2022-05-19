import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAmMegaMenuContext } from '../../../context';
import MenuItem from '../menuItem';

jest.mock('../../MenuTree/menuLink', () => 'MenuLink');
jest.mock('../../MenuTree/SubMenuContent', () => 'SubMenuContent');
jest.mock('../../../context', () => ({
  useAmMegaMenuContext: jest.fn().mockName('useAmMegaMenuContext')
}));

test('renders correct tree', () => {
  useAmMegaMenuContext.mockReturnValue({
    isMobile: true,
    isShowIcons: true,
    config: {}
  });
  const tree = createTestInstance(<MenuItem />);
  expect(tree.toJSON()).toMatchSnapshot();
});
