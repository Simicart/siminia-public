import { gql } from '@apollo/client';
import { GiftcartListingFragment } from '../../../nativeInner/CartCore/ProductListing/productListingFragments.gql.js';

export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
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
                row_total_including_tax {
                    value
                    currency
                }
                row_total {
                    value
                    currency
                }
                total_item_discount {
                    value
                    currency
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
                virtual_customizable_options: customizable_options {
                    label
                    values {
                        label
                        value
                    }
                }
            }
            ... on DownloadableCartItem {
                downloadable_customizable_options: customizable_options {
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
                bundle_customizable_options: customizable_options {
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
            ...GiftcartListingFragment
        }
    }
    ${GiftcartListingFragment}
`;
