import { useQuery, gql } from '@apollo/client'

const GET_ORDERED_GIFT_CARD_ID = gql`
query getOrderedId {
    customerOrders {
        items {
            id
            increment_id
        }
    }
}
`

const useOrderedGiftCardId = () => {
    const orderData = useQuery(GET_ORDERED_GIFT_CARD_ID, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network'
    })
    return orderData
}

export { useOrderedGiftCardId, GET_ORDERED_GIFT_CARD_ID }