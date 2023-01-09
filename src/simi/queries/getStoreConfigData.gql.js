import { gql } from '@apollo/client';

const simiconnectorEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_CONNECTOR &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_CONNECTOR) === 1;

const socialLoginEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SOCIAL_LOGIN &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SOCIAL_LOGIN) === 1;

const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

const rewardPointsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_REWARD_POINTS) === 1;

const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;
const deliveryTimeEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_DELIVERY_TIME) === 1;

const GET_STORE_CONFIG = gql`
    query storeConfigData {
        storeConfig {
            id
            head_shortcut_icon
            header_logo_src
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
            configurable_thumbnail_source
            ${
                mageworxSeoEnabled
                    ? `
                mageworx_seo
            `
                    : ''
            }
            ${
                socialLoginEnabled
                    ? `
                amsociallogin_general_enabled
                amsociallogin_general_login_position
                amsociallogin_general_button_shape
                amsociallogin_general_popup_enabled
                amsociallogin_general_button_position
                amsociallogin_general_redirect_type
                amsociallogin_general_custom_url
            `
                    : ''
            }
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
            children_count
            children {
                id
                include_in_menu
                name
                position
                url_path
                url_suffix
                children_count
                children {
                    id
                    include_in_menu
                    name
                    position
                    url_path
                    url_suffix
                    children_count
                    children {
                        id
                        include_in_menu
                        name
                        position
                        url_path
                        url_suffix
                        children_count
                    }
                }
            }
        }
        ${
            socialLoginEnabled
                ? `
            amSocialLoginButtonConfig {
                type
                label
                url
            }
        `
                : ''
        }
        ${
            simiconnectorEnabled
                ? `
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
                            footer_block
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
            `
                : ''
        }
        ${
            rewardPointsEnabled
                ? `
            bssRewardPointStoreConfig(storeview: 1) {
                active
                redeem_threshold
                maximum_threshold
                expire_day
                earn_tax
                earn_shipping
                earn_order_paid
                maximum_earn_order
                maximum_earn_review
                auto_refund
                maximum_point_order
                allow_spend_tax
                allow_spend_shipping
                restore_spent
                point_icon
                sw_point_header
                point_mess_register
                point_subscrible
                cart_order_summary
                product_page_tab_review
                product_page_reward_point
                cate_page_reward_point
                point_slider
                sender
                earn_point_template
                spend_point_template
                expiry_warning_template
                expire_day_before
                subscrible
            }
            `
                : ''
        }
        ${
            productLabelEnabled
                ? `bssProductLabelStoreConfig(store_view: 1) {
            active
            display_multiple_label
            display_only_out_of_stock_label
            not_display_label_on
            selector_product_list
            selector_product_page
          }`
                : ''
        }
        ${
            deliveryTimeEnabled
                ? `
                bssDeliveryDateStoreConfig(store_view: 1){
                  active
                  as_processing_days
                  block_out_holidays
                  cut_off_time
                  date_day_off
                  date_fields
                  icon_calendar
                  is_field_required_comment
                  is_field_required_date
                  is_field_required_timeslot
                  on_which_page
                  process_time
                  shipping_comment
                  time_slots
              }`
                : ''
        }
    }
`;
export default GET_STORE_CONFIG;
