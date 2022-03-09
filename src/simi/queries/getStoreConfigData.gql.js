import { gql } from '@apollo/client';

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
            ${!!mageworxSeoEnabled &&
                `
                mageworx_seo
            `}
            ${!!socialLoginEnabled &&
                `
                amsociallogin_general_enabled
                amsociallogin_general_login_position
                amsociallogin_general_button_shape
                amsociallogin_general_popup_enabled
                amsociallogin_general_button_position
                amsociallogin_general_redirect_type
                amsociallogin_general_custom_url
            `}
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
                children {
                    id
                    include_in_menu
                    name
                    position
                    url_path
                    url_suffix
                    children {
                        id
                        include_in_menu
                        name
                        position
                        url_path
                        url_suffix
                    }
                }
            }
        }
        ${!!socialLoginEnabled &&
            `
            amSocialLoginButtonConfig {
                type
                label
                url
            }
        `}
    }
`;
export default GET_STORE_CONFIG;
