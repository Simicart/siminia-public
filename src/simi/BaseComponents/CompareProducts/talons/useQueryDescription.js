import { gql } from "@apollo/client";

const GET_PRODUCT_DESCRIPTION = gql`
query getProductDescription($urlKey: [String]) {
   products(filter: { url_key: { in: $urlKey } }) {
       items {
           description {
                html
           }
       }
   }
}
`

export default GET_PRODUCT_DESCRIPTION