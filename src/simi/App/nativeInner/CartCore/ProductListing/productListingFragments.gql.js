import { gql } from '@apollo/client';

const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

export const GiftcartListingFragment = gql`
          fragment GiftcartListingFragment on CartItemInterface {
              id
          }
      `;

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            uid
            product {
                id
                name
                sku
                url_key
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
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
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
