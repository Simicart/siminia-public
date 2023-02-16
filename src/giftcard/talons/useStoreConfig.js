import { useQuery, gql } from '@apollo/client'

const GET_GIFT_CARD_CONFIG = gql`
query bssGiftCardStoreConfig($store_view: Int) {
    bssGiftCardStoreConfig(store_view: $store_view) {
        active
        active_to_sender
        sender_identity
        to_sender
        to_recipient
        notify_to_recipient
        day_before_notify_expire
        expire_day
        number_character
        replace_character
        max_time_limit
    }
}
`

const useStoreConfig = () => {
    const storeConfig = useQuery(GET_GIFT_CARD_CONFIG, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network',
        variables: {
            store_view: 1
        }
    })

    return storeConfig
}

export default useStoreConfig