import gql from 'graphql-tag';

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
                small_image {
                    url
                }
                stock_status
            }
            prices {
                price {
                    currency
                    value
                }
                row_total {
                    value
                    currency
                }
                row_total_including_tax {
                    value
                    currency
                }
                discounts {
                    amount {
                        value
                        currency
                    }
                    label
                }
                total_item_discount {
                    value
                    currency
                }
            }
            quantity
            simi_cart_item_data {
                stock_status
                stock_error_message
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
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
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
