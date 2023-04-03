import { useQuery, gql } from '@apollo/client'
import {SimiPriceFragment} from '../../simi/queries/catalog_gql/catalogFragment.gql';

const GET_FBT_PRODUCT_DATA = gql`
query getFbtProductData($product_sku: String) {
    products(filter: { sku: { eq: $product_sku } }) {
      items {
        name
        fbt_product_data {
          ...on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
                label
                values {
                    default_label
                    store_label
                    label
                    swatch_data {
                        value
                    }
                    uid
                    use_default_value
                }
            }
          }
        id
        name
        sku
        small_image {
            url
            label
        }
        media_gallery_entries {
            label
            position
            disabled
            file
        }
        url_key
        special_price
        special_from_date
        type_id
        special_to_date
        stock_status
        price {
            ...SimiPriceFragment
        }
        price_tiers {
            quantity
            final_price {
                value
                currency
            }
        }
        rating_summary
        review_count
        }
      }
    }
  }
  ${SimiPriceFragment}
`

const useFbtData = (product_sku) => {
  const product = useQuery(GET_FBT_PRODUCT_DATA, {
    variables: {
      product_sku: product_sku
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network'
  })

  return product
}

export default useFbtData