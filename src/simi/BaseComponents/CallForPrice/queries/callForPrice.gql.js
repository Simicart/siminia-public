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
      is_show_customer_fields
      recaptcha
      site_key
    }
  }
`;

export const Call_FOR_PRICE_MUTATION = gql`
  mutation callForPrice(
    $skuProduct: String
    $name: String
    $mail: String
    $extraField: String
  ) {
    callForPrice (
      sku_product: $skuProduct
      name: $name
      mail: $mail
      extra_field: $extraField
    ) {
      status
      store_id
      customer_name
      customer_email
      extra_field
      created_at
      product_id
      product_name
    }
  }
` 

export default {
    getCallForPriceConfig: GET_CALL_FOR_PRICE_CONFIG,
    callForPriceMutaion: Call_FOR_PRICE_MUTATION
}