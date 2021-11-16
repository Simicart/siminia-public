import React from 'react';
import gql from 'graphql-tag';
import { HOPrice as Price } from 'src/simi/Helper/Pricing'

import { mergeClasses } from 'src/classify'
/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const ShippingSummary = props => {
    const classes = mergeClasses({}, props.classes);
    const { data, isCheckout } = props;

    // Don't render estimated shipping until an address has been provided and
    // a method has been selected.
    if (!data.length || !data[0].selected_shipping_method) {
        return null;
    }

    const shipping = data[0].selected_shipping_method.amount;

    // For a value of "0", display "FREE".
    const price = shipping.value ? (
        <Price value={shipping.value} currencyCode={shipping.currency} />
    ) : (
        <span>{'FREE'}</span>
    );

    return (
        <>
            <span className={classes.lineItemLabel}>
                {isCheckout ? 'Shipping' : 'Estimated Shipping'}
            </span>
            <span className={classes.price}>{price}</span>
        </>
    );
};

export const ShippingSummaryFragment = gql`
    fragment ShippingSummaryFragment on Cart {
        id
        shipping_addresses {
            customer_notes
            firstname
            lastname
            company
            street
            city
            region {
                code
                label
                region_id
            }
            postcode
            country {
                code
                label
            }
            telephone
            available_shipping_methods {
                carrier_code
                method_code
                carrier_title
                method_title
                amount {
                    currency
                    value
                }
            }
            selected_shipping_method {
                carrier_code
                method_code
                carrier_title
                method_title
                amount {
                    currency
                    value
                }
            }
        }
    }
`;

export default ShippingSummary;
