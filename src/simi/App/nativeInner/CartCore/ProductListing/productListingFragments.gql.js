import { gql } from '@apollo/client';

const giftcardEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

export const GiftcartListingFragment = giftcardEnabled
    ? gql`
          fragment GiftcartListingFragment on CartItemInterface {
              ... on MpGiftCardCartItem {
                  giftcard_options {
                      item_id
                      code
                      option_id
                      product_id
                      value
                  }
              }
          }
      `
    : gql`
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
