import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            product {
                id
                name
                sku
                url_key
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            small_image {
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
                    configurable_product_option_value_uid
                    option_label
                    value_id
                    value_label
                }
            }
            ... on SimpleCartItem {
                customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
            }
            ... on VirtualCartItem {
                virtual_customizable_options : customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
            }
            ... on DownloadableCartItem {
                downloadable_customizable_options : customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
                links {
                    id
                    title
                    sort_order
                    price
                    sample_url
                    is_shareable
                    number_of_downloads
                    link_type
                    sample_type
                    sample_file
                }
            }
            ... on BundleCartItem {
                bundle_customizable_options : customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
                bundle_options {
                    label
                    type
                    values {
                        label
                        quantity
                    }
                }
            }
        }
    }
`;
export const GET_PRODUCT_LISTING = gql`
    query getProductListing($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ProductListingFragment
        }
    }
    ${ProductListingFragment}
`;
