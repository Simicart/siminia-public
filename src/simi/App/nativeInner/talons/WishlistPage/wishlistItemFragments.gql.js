import { gql } from '@apollo/client';
const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        product {
            ${
                productLabelEnabled
                    ? `
                mp_label_data {
                    list_position
                    list_position_grid
                    label_image
                    label_font
                    label_font_size
                    label_color
                    label_template
                    priority
                    label
                }        
            `
                    : ``
            }
            id
            image {
                label
                url
            }
            name
            price_range {
                maximum_price {
                    final_price {
                        currency
                        value
                    }
                }
            }
            sku
            stock_status
            ... on ConfigurableProduct {
                configurable_options {
                    id
                    attribute_code
                    attribute_id
                    attribute_id_v2
                    label
                    values {
                        uid
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
            }
        }
        ... on ConfigurableWishlistItem {
            configurable_options {
                id
                option_label
                value_id
                value_label
            }
        }
    }
`;
