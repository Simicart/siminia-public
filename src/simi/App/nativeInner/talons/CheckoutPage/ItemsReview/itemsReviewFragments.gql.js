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
                stock_status
                ${
                    productLabelEnabled
                        ? `
                        product_label {
                            name
                            image
                            image_data {
                                left
                                top
                                width
                                height
                                widthOrigin
                                heightOrigin
                                angle
                            }
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
