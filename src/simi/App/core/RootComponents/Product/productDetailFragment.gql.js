import { gql } from '@apollo/client';
import {SimiPriceFragment} from "src/simi/queries/catalog_gql/catalogFragment.gql";

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
            sizeChartEnabled
                ? `
            mp_sizeChart {
                rule_id
                name
                rule_content
                template_styles
                enabled
                display_type
                conditions_serialized
                attribute_code
                demo_templates
                priority
                rule_description
            }
        `
                : ``
        }
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
        meta_description
        mpbrand{
            image
        }
        name
        price {
            ...SimiPriceFragment    
        }
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
                options {
                    id
                    quantity
                    position
                    is_default
                    price
                    price_type
                    can_change_quantity
                    label
                    product {
                        id
                        name
                        sku
                        tier_price
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
`;

// might detach upsell_products and cross-sell for performance
