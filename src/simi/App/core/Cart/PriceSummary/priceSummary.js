import React from 'react';
import gql from 'graphql-tag';
import { usePriceSummary } from 'src/simi/talons/CartPage/PriceSummary/usePriceSummary';
import { PriceSummaryFragment } from './priceSummaryFragments';
import Total from 'src/simi/BaseComponents/Total'
import Identify from 'src/simi/Helper/Identify'

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

const PriceSummary = () => {
    const talonProps = usePriceSummary({
        queries: {
            getPriceSummary: GET_PRICE_SUMMARY
        }
    });

    const {
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        cartPrices,
        cartShipping
    } = talonProps;

    if (hasError) {
        return (
            <div className="price-summary-err">
                {Identify.__('Something went wrong. Please refresh and try again.')}
            </div>
        );
    } else if (!hasItems || isLoading) {
        return null;
    }
        
    return <Total prices={cartPrices} isCheckout={isCheckout} cartShipping={cartShipping}/>
};

export default PriceSummary;
