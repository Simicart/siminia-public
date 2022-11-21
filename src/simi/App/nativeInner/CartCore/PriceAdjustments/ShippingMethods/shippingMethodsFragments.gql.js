import {gql} from "@apollo/client";

export const SelectedShippingMethodCartFragment = gql`
    fragment SelectedShippingMethodCartFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                carrier_code
                method_code
                method_title
            }
            street
        }
    }
`;
