import { gql } from '@apollo/client';
const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

const GET_PRODUCT_LABEL = gql`
    query getProductLabel ($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                ${
                    productLabelEnabled
                        ? `
                product_label {
                    active
                    apply_outofstock_product
                    conditions_serialized {
                      aggregator
                      attribute
                      conditions
                      is_value_processed
                      operator
                      type
                      value
                    }
                    created_at
                    customer_groups
                    image
                    id
                    image_data {
                      angle
                      height
                      heightOrigin
                      left
                      top
                      width
                      widthOrigin
                    }
                    name
                    priority
                    store_views
                    updated_at
                    valid_end_date
                    valid_start_date
                  }
                
                `
                        : `sku`
                }
               
              
        
            }}
    }
`;
export default {
    getProductLabel: GET_PRODUCT_LABEL
};
