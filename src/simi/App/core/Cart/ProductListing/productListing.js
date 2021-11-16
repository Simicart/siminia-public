import React, { Fragment, useCallback } from 'react';
import gql from 'graphql-tag';
import { useProductListing } from 'src/simi/talons/CartPage/ProductListing/useProductListing';
import { ProductListingFragment } from './productListingFragments';
import CartItem from './CartItem';
import Identify from 'src/simi/Helper/Identify';
import ProductListingTableActions from './productListingTableActions'

const ProductListing = props => {
    const { setIsCartUpdating, isPhone, cartCurrencyCode, history, toggleMessages } = props;
    const talonProps = useProductListing({
        queries: {
            getProductListing: GET_PRODUCT_LISTING
        }
    });
    const { activeEditItem, isLoading, items, setActiveEditItem } = talonProps;

    const handleLink = useCallback((link) => {
        history.push(link);
    }, [history])

    if (isLoading) {
        return ''
    }

    if (items.length) {
        const obj = [];
        for (const i in items) {
            const item = items[i];
            if (item)
                obj.push(
                    <CartItem
                        key={item.id}
                        item={item}
                        currencyCode={cartCurrencyCode}
                        handleLink={handleLink}
                        history={history}
                        miniOrMobile={isPhone}
                        setActiveEditItem={setActiveEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                    />
                );
        }
        return isPhone ? (
            <div className="cart-list">
                {obj}
            </div>
        ) : (
                <Fragment>
                    <table className="cart-list-table">
                        <tbody>
                            <tr className="cart-list-table-header">
                                <th style={{ width: '42.2%' }}>
                                    {Identify.__('Items')}
                                </th>
                                <th style={{ width: '16.8%' }}>
                                    {Identify.__('Price')}
                                </th>
                                <th style={{ width: '24.2%' }}>
                                    {Identify.__('Quantity')}
                                </th>
                                <th style={{ width: '16.8%' }}>
                                    {Identify.__('Subtotal')}
                                </th>
                            </tr>
                            {obj}
                        </tbody>
                    </table>
                    <ProductListingTableActions
                        handleLink={handleLink}
                        setIsCartUpdating={setIsCartUpdating}
                        items={items}
                    />
                </Fragment>
            )
    }
    return null;
};

export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;

export default ProductListing;
