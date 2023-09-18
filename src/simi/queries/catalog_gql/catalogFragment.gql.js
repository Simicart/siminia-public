import { gql } from '@apollo/client';
const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        description
        cms_block {
            identifier
            title
            content
        }
        display_mode
        url_key
        url_path
        name
        id
        image
        breadcrumbs {
            category_id
            category_level
            category_name
            category_url_key
            category_url_path
        }
        meta_title
        meta_keywords
        meta_description
    }
`;

export const SimiPriceFragment = gql`
    fragment SimiPriceFragment on ProductPrices {
        regularPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
        minimalPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
        maximalPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
    }
`;

const ConfigurableOptionsFragment = gql`
    fragment ConfigurableOptionsFragment on ConfigurableProduct {
        configurable_options {
            attribute_code
            attribute_id
            id
            label
            values {
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
        variants {
            attributes {
                code
                value_index
            }
            product {
                id
                media_gallery_entries {
                    id
                    disabled
                    file
                    label
                    position
                }
                sku
                # stock_status
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
            }
        }
    }
`;

export const ProductOfListFragment = gql`
    fragment ProductOfListFragment on ProductInterface {
        id
        name
        sku
        small_image {
            url
            label
        }
        media_gallery_entries {
            label
            position
            disabled
            file
        }
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
        url_key
        special_price
        special_from_date
        type_id
        special_to_date
        # stock_status
        price {
            ...SimiPriceFragment
        }
        price_tiers {
            quantity
            final_price {
                value
                currency
            }
        }
        rating_summary
        review_count
        ... on CustomizableProductInterface {
            options {
                title
            }
        }
    }
    ${SimiPriceFragment}
`;

