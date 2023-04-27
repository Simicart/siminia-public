import { gql } from "@apollo/client";

const GET_PRODUCT_DESCRIPTION = gql`
query getProductDescription($urlKey: String) {
   products(filter: { url_key: { eq: $urlKey } }) {
       items {
           description {
                html
           }
           simiExtraField
       }
   }
}
`

export default GET_PRODUCT_DESCRIPTION