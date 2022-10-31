import React from 'react';
import MenuTree from '../MenuTree';
import { useTopMenu } from '../../talons/useTopMenu';
// import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu/megaMenu';
// import classes from '../../../../App/nativeInner/Header/header.module.css';

const TopMenu = props => {
    const { menuTree, isEnabled, config } = useTopMenu();
    if (!isEnabled) {
        // return (
        //     <div className={classes['header-megamenu-ctn']}>
        //         <MegaMenu classes={classes} />
        //     </div>
        // );
        return null
    }

    return <MenuTree {...props} config={config} menuTree={menuTree} />;
};

export default TopMenu;
