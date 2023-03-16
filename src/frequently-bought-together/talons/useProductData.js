import { useQuery, gql } from '@apollo/client'

const GET_PRODUCT_DATA = gql`
query getProductData($sku: String) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        crosssell_products {
          name
          rating_summary
          sku
          stock_status
          image {
            url
          }
        }
        fbt_product_data {
          name
          price
          sku
          type_product
          url_img
          url_product
        }
        related_products {
          name
          rating_summary
        }
        upsell_products {
          name
          rating_summary
        }
      }
    }
  }
`