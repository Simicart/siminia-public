import React from 'react';
import MenuTree from '../MenuTree';
import { useTopMenu } from '../../talons/useTopMenu';
import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu/megaMenu';

const TopMenu = props => {
  const { menuTree, isEnabled } = useTopMenu();
  if (!isEnabled) {
    return <MegaMenu />;
  }

  return <MenuTree {...props} menuTree={menuTree} />;
};

export default TopMenu;
