import gql from 'graphql-tag';
export const GET_STORE_CONFIG_DATA = gql`
query storeConfigData {
    storeConfig {
        mageworx_seo
    }
    currency {
        default_display_currency_code
        available_currency_codes
    }
}   
`;