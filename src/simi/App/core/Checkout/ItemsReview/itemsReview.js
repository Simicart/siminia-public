import React, { useState } from 'react';

import { useItemsReview } from 'src/simi/talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { mergeClasses } from 'src/classify';
import LIST_OF_PRODUCTS_IN_CART_QUERY from './itemsReview.gql';
import Identify from 'src/simi/Helper/Identify';
import defaultClasses from './itemsReview.css';
import ArrowDown from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowDown';
import ArrowUp from 'src/simi/BaseComponents/Icon/TapitaIcons/ArrowUp';

/**
 * Renders a list of items in an order.
 * @param {Object} props.data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = props => {
    const { classes: propClasses, orderNumber } = props;
    const [showItems, setShowItems] = useState(false);
    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useItemsReview({
        queries: {
            getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
        },
        data: props.data
    });

    const {
        items: itemsInCart,
        totalQuantity,
        showAllItems,
        setShowAllItems,
        isLoading
    } = talonProps;

    const items = itemsInCart.map((item, index) => (
        <Item key={item.id} {...item} />
    ));

    if (isLoading) {
        return (
            <LoadingIndicator>{Identify.__('Fetching Items')}</LoadingIndicator>
        );
    }

    return (
        <div className={classes.items_review_container}>
            <div className={classes.items_container}>
                <div
                    className={classes.total_quantity}
                    onClick={() => setShowItems(!showItems)}
                >
                    <div className={classes.total_quantity_label}>
                        {
                            orderNumber ? Identify.__(`%s Item(s) in your order`).replace('%s', totalQuantity) :
                                Identify.__(`%s Item(s) in cart`).replace('%s', totalQuantity)
                        }
                    </div>
                    <div>{showItems ? <ArrowUp /> : <ArrowDown />}</div>
                </div>
                {showItems && items}
            </div>
        </div>
    );
};

export default ItemsReview;
