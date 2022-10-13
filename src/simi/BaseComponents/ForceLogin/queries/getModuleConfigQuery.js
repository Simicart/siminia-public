import { gql } from 'graphql-tag';

export default gql`
    query getBssForceLoginConfig {
        bssForceLoginConfig {
            enable
            disable_registration
            force_login_page_type
            ignore_router
            list_ignore_router
            force_login_specific_page
            force_login_product_page
            force_login_category_page
            force_login_cart_page
            force_login_checkout_page
            force_login_search_term_page
            force_login_advanced_search_page
            force_login_search_result_page
            force_login_contact_page
            force_login_cms_page
            force_login_cms_page_ids
            redirect_to
            redirect_custom_url
            force_login_message
        }
    }
`;
