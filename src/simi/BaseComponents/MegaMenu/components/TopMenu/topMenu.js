import React from 'react';
import MenuTree from '../MenuTree';
import { useTopMenu } from '../../talons/useTopMenu';
import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu/megaMenu';
import classes from './topMenu.module.css'

const TopMenu = props => {
  const { menuTree, isEnabled } = useTopMenu();
 
  if (!isEnabled) {
    return <MegaMenu classes={classes} />;
  }

  return <MenuTree {...props} menuTree={menuTree} />;
};

export default TopMenu;
