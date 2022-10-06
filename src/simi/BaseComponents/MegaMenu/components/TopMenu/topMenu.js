import React from 'react';
import MenuTree from '../MenuTree';
import { useTopMenu } from '../../talons/useTopMenu';
// import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu/megaMenu';
// import classes from '../../../../App/nativeInner/Header/header.module.css';

const TopMenu = props => {
    const { menuTree, isEnabled } = useTopMenu();
    console.log("isEnabled",isEnabled);
    if (!isEnabled) {
        // return (
        //     <div className={classes['header-megamenu-ctn']}>
        //         <MegaMenu classes={classes} />
        //     </div>
        // );
        return null
    }

    return <MenuTree {...props} menuTree={menuTree} />;
};

export default TopMenu;
