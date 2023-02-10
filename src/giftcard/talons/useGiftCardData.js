import { useQuery, gql } from '@apollo/client';

const GET_GIFT_CARD_DETAILS = gql`
    query getGiftCardDetails($filter: String) {
        products (filter: {sku: {eq: $filter}}) {
          items {
            ... on BssGiftCardProduct {
              name
              stock_status
              sku
              small_image {
                url
              }
              giftcard_options {
                expires_at
                amount {
                  id
                  price
                  value
                }
                dynamic_price {
                  enable
                  max_value
                  percentage_price_type
                  percentage_price_value
                  min_value
                }
                template {
                  template_id
                  status
                  code_color
                  message_color
                  images {
                     id
                     url
                  }
                }
              }
            }
          }
        }
    }
`

const useGiftCardData = (filter) => {
  const giftCardDetails = useQuery(GET_GIFT_CARD_DETAILS, {
    variables: {filter: filter},
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-and-network',
  })

  return giftCardDetails
}

export default useGiftCardData