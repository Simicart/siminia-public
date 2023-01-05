import { gql } from '@apollo/client';
const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;
export const SimiItemsReviewFragment = gql`
    fragment SimiItemsReviewFragment on Cart {
        id
        total_quantity
        items {
            id
            product {
                id
                name
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
                            file
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
                        : ``
                }
                thumbnail {
                    url
                }
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            thumbnail {
                                url
                            }
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
