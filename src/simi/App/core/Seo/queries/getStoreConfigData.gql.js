import { gql } from '@apollo/client';
const mageworxSeoEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_MAGEWORX_SEO) === 1;

export const GET_STORE_CONFIG_DATA = gql`
query storeConfigData {
    storeConfig {
        ${mageworxSeoEnabled ? `mageworx_seo` : `id`}
    }
    currency {
        default_display_currency_code
        available_currency_codes
    }
}   
`;
