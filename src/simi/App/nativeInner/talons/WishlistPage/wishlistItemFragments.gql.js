import { gql } from '@apollo/client';
import { isGiftCardEnable } from 'src/simi/App/nativeInner/Helper/Module'
import {SimiPriceFragment} from "src/simi/queries/catalog_gql/catalogFragment.gql";

const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

const giftCardEnabled = isGiftCardEnable()

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        product {
            url_key
          	url_suffix
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
            id
            image {
                label
                url
            }
            name
            price {
                ...SimiPriceFragment
            }
            small_image {
                url
                label
            }
            rating_summary
            review_count
            price_range {
                maximum_price {
                    regular_price {
                        currency
                        value
                      }
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
            ${
                giftCardEnabled
                    ? `
                    ... on MpGiftCardProduct {
                        information {
                            amounts {
                                record_id
                                price
                                amount
                            }
                            openAmount {
                                min
                                max
                                rate
                            }
                        }
                      
                        max_amount
                        min_amount
                        price_rate
                        allow_amount_range
                    }      
            `
                    : ``
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
    ${SimiPriceFragment}
`;
