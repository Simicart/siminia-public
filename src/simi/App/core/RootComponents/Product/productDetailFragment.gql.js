import { gql } from '@apollo/client';
import { SimiPriceFragment } from 'src/simi/queries/catalog_gql/catalogFragment.gql';

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

const metaPackageEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_META_PACKAGES &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_META_PACKAGES) === 1;

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
        ${
            shopByBrandEnabled
                ? `mpbrand{
                image
            }`
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
        media_gallery {
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
`;

// might detach upsell_products and cross-sell for performance
