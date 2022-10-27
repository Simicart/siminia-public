import React, { Fragment, useMemo } from 'react';
import { useWishlistItems } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItems';

import { useStyle } from '@magento/venia-ui/lib/classify.js';
import defaultClasses from './wishlistItems.module.css';
import WishlistItem from './wishlistItem';
import AddToCartDialog from '@magento/venia-ui/lib/components/AddToCartDialog';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import Loader from '../Loader';
import Pagination from 'src/simi/BaseComponents/Pagination';

const WishlistItems = props => {
    const { items, wishlistId, itemsCount } = props;
    console.log('items', items);
    const talonProps = useWishlistItems();
    const {
        activeAddToCartItem,
        handleCloseAddToCartDialog,
        handleOpenAddToCartDialog
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    // const itemElements = useMemo(() => {
    //     return items.map(item => {
    //         return (
    //             <WishlistItem
    //                 key={item.id}
    //                 item={item}
    //                 onOpenAddToCartDialog={handleOpenAddToCartDialog}
    //                 wishlistId={wishlistId}
    //             />
    //         );
    //     });
    // }, [handleOpenAddToCartDialog, items, wishlistId]);

    const renderItem = (item, index) => {
        return (
            <WishlistItem
                key={item.id}
                item={item}
                onOpenAddToCartDialog={handleOpenAddToCartDialog}
                wishlistId={wishlistId}
            />
        );
    };

    let rows = null;

    if (itemsCount && items && items.length) {
        rows = (
            <Pagination
                data={items}
                renderItem={renderItem}
                itemsPerPageOptions={[8, 16, 32]}
                showItemPerPage={false}
                showInfoItem={false}
                limit={8}
                itemCount={itemsCount}
                // changedPage={() =>  smoothScrollToView(document.getElementById('root'))}
                // changeLimit={() =>  smoothScrollToView(document.getElementById('root'))}
            />
        );
    } else {
        rows = <Loader />;
    }

    return (
        <Fragment>
            <div className={classes.root}>{rows}</div>
            <AddToCartDialog
                item={activeAddToCartItem}
                onClose={handleCloseAddToCartDialog}
            />
        </Fragment>
    );
};

export default WishlistItems;
