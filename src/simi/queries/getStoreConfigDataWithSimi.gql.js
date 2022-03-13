import { gql } from '@apollo/client';

const GET_STORE_CONFIG = gql`
    query storeConfigData {
        simiStoreConfig {
            store_id
            currency
            pwa_studio_client_ver_number
            root_category_id
            config {
                base {
                    country_code
                    country_name
                    magento_version
                    locale_identifier
                    store_id
                    store_name
                    store_code
                    group_id
                    base_url
                    is_rtl
                    currency_symbol
                    currency_code
                    currency_position
                    thousand_separator
                    decimal_separator
                    max_number_of_decimals
                    currencies {
                        value
                        title
                        symbol
                    }
                    default_title
                    default_description
                    default_keywords
                }
                sales {
                    sales_reorder_allow
                    sales_minimum_order_active
                    sales_minimum_order_amount
                    sales_minimum_order_description
                    sales_minimum_order_error_message
                }
                checkout {
                    enable_guest_checkout
                    enable_agreements
                }
                tax {
                    tax_display_type
                    tax_display_shipping
                    tax_cart_display_price
                    tax_cart_display_subtotal
                }
                catalog {
                    seo {
                        product_url_suffix
                        category_url_suffix
                    }
                    frontend {
                        show_size_in_compare
                        footer_title1
                        footer_title2
                        footer_link
                    }
                    review {
                        catalog_review_active
                        catalog_review_allow_guest
                    }
                }
                rating_form {
                    rate_code
                    rate_options {
                        key
                        value
                    }
                }
            }
        }
        storeConfig {
            id
            copyright
            code
            website_id
            locale
            base_currency_code
            default_display_currency_code
            timezone
            weight_unit
            base_url
            base_link_url
            base_static_url
            base_media_url
            secure_base_url
            secure_base_link_url
            secure_base_static_url
            secure_base_media_url
            cms_home_page
            store_group_name
            store_name
            category_url_suffix
            product_url_suffix
            magento_wishlist_general_is_enabled
            copyright
            cms_no_route
            show_cms_breadcrumbs
            required_character_classes_number
            logo_alt
            logo_height
            logo_width
            product_reviews_enabled
            allow_guests_to_write_product_reviews
            head_includes
            configurable_thumbnail_source
            title_separator
            title_prefix
            title_suffix
            default_title
            default_keywords
            default_description
            root_category_id
        }
        availableStores {
            category_url_suffix
            code
            default_display_currency_code
            id
            locale
            product_url_suffix
            secure_base_media_url
            store_group_code
            store_group_name
            store_name
            store_sort_order
        }
        currency {
            default_display_currency_code
            available_currency_codes
        }
        categoryList {
            id
            name
            image
            children {
                id
                include_in_menu
                name
                position
                url_path
                url_suffix
                image
                children {
                    id
                    include_in_menu
                    name
                    position
                    url_path
                    url_suffix
                    image
                    children {
                        id
                        include_in_menu
                        name
                        position
                        url_path
                        url_suffix
                        image
                    }
                }
            }
        }
    }
`;
export default GET_STORE_CONFIG;
