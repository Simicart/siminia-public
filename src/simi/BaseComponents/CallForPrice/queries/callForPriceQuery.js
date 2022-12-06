import { gql } from 'graphql-tag';

export const GET_CALL_FOR_PRICE_CONFIG = gql`
  query {
    getConfigAdvancedHidePrice {
      enable
      form_fields {
        field_label
        field_type
        field_order
        field_required
        field_enable
      }
    }
    
  }
`;

export default {
    getCallForPriceConfig: GET_CALL_FOR_PRICE_CONFIG
}