import { useQuery, gql } from '@apollo/client'

const GET_ORDERED_GIFT_CARDS = gql`
query getOrderedGiftCard {
    bssCustomerGiftCards {
      code
      expire_date
      order_id
      status {
        label
        value
      }
      value
    }
  }
`

const useOrderedGiftCards = () => {
    const orderedGiftCards = useQuery(GET_ORDERED_GIFT_CARDS, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network',
     })
     return orderedGiftCards
}

export { useOrderedGiftCards, GET_ORDERED_GIFT_CARDS }