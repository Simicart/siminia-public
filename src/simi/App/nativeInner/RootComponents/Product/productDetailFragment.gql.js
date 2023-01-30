import { gql } from '@apollo/client';
import { SimiPriceFragment } from 'src/simi/queries/catalog_gql/catalogFragment.gql';

const sizeChartEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SIZE_CHART &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SIZE_CHART) === 1;

const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;
const shopByBrandEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND) === 1;

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

const callForPriceEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CALL_FOR_PRICE) === 1;

const giftCardEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_GIFT_CARD) === 1;

const metaPackageEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_META_PACKAGES &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_META_PACKAGES) === 1;

const rewardPointEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;
    
export const ProductCustomAttributesFragment = metaPackageEnabled
    ? gql`
          fragment ProductCustomAttributesFragment on ProductInterface {
              custom_attributes {
                  selected_attribute_options {
                      attribute_option {
                          uid
                          label
                          is_default
                      }
                  }
                  entered_attribute_value {
                      value
                  }
                  attribute_metadata {
                      uid
                      code
                      label
                      attribute_labels {
                          store_code
                          label
                      }
                      data_type
                      is_system
                      entity_type
                      ui_input {
                          ui_input_type
                          is_html_allowed
                      }
                      ... on ProductAttributeMetadata {
                          used_in_components
                      }
                  }
              }
          }
      `
    : gql`
          fragment ProductCustomAttributesFragment on ProductInterface {
              id
          }
      `;

export const RewardPointFragment = rewardPointEnabled
    ? gql`
          fragment RewardPointFragment on ProductInterface {
                reward_point {
                    product_point {
                        assign_by
                        receive_point
                        dependent_qty
                        point
                        message
                    }
                    customer_point {
                        review_point
                        message
                    }
                }
          }
      `
    : gql`
          fragment RewardPointFragment on ProductInterface {
              sku
          }
      `;


export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        categories {
            id
            uid
            breadcrumbs {
                category_id
            }
        }
        description {
            html
        }
        id
        uid
        ${
            callForPriceEnabled
                ? `
            advancedhideprice {
                advancedhideprice_text
                advancedhideprice_type
            }
        `
                : ``
        }
        ${
            mageworxSeoEnabled
                ? `
            mageworx_canonical_url{
                url
                __typename
                extraData
            }`
                : ``
        }
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
        ${
            shopByBrandEnabled
                ? `mpbrand{
                image
            }`
                : ``
        }
        ${
            giftCardEnabled
                ? `
                ... on MpGiftCardProduct {
                    allow_amount_range
                    gift_card_type
                    gift_card_amounts
                    gift_code_pattern
                    gift_product_template
                    gift_message_available
                    mpgiftcard_conditions
                    can_redeem
                    price_rate
                    min_amount
                    max_amount
                    template {
                        id
                        name
                        font
                        images {
                            alt
                            src
                            file
                        }
                        title
                        design
                        card
                        canUpload
                    }
                }
            `
                : ``
        }
        
        media_gallery_entries {
            # id is deprecated and unused in our code, but lint rules require we
            # request it if available
            id
            uid
            label
            position
            disabled
            file
        }
        media_gallery{
            disabled
            url
            label
            position
        }
        meta_description
        name
        price {
            ...SimiPriceFragment    
        }
        ...ProductCustomAttributesFragment
        ...RewardPointFragment
        sku
        small_image {
            url
        }
        stock_status
        url_key
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
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
            variants {
                attributes {
                    code
                    value_index
                }
                product {
                    id
                    uid
                    media_gallery_entries {
                        # id is deprecated and unused in our code, but lint rules require we
                        # request it if available
                        id
                        uid
                        disabled
                        file
                        label
                        position
                    }
                    sku
                    stock_status
                    price {
                        ...SimiPriceFragment
                    }
                }
            }
        }
        ... on GroupedProduct {
            items {
                qty
                position
                product {
                    id
                    sku
                    name
                    type_id
                    url_key
                    price_range {
                        maximum_price {
                            final_price {
                                value
                                currency
                            }
                        }
                        minimum_price {
                            final_price {
                                value
                                currency
                            }
                        }
                    }
                }
            }
        }
        ... on DownloadableProduct {
            links_title
            links_purchased_separately
            downloadable_product_links {
                id
                sample_url
                sort_order
                title
                price
            }
            downloadable_product_samples {
                title
                sort_order
                sample_url
            }
        }
        ... on BundleProduct {
            items {
                option_id
                title
                required
                type
                position
                sku
            }
        }
        ... on CustomizableProductInterface {
            options {
                title
                required
                sort_order
                option_id
                uid
            }
        }
        rating_summary
        review_count
        price_tiers {
            quantity
            final_price {
                currency
                value
            }
            discount {
                amount_off
                percent_off
            }
        }
        short_description {
            html
        }
        only_x_left_in_stock
        related_products {
            id
            sku
        }
        upsell_products {
            id
            sku
        }
        crosssell_products {
            id
            sku
        }
    }
    ${SimiPriceFragment}
    ${ProductCustomAttributesFragment}
    ${RewardPointFragment}
`;

// might detach upsell_products and cross-sell for performance
