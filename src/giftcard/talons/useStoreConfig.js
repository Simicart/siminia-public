import { useQuery, gql } from '@apollo/client'

const GET_GIFT_CARD_CONFIG = gql`
bssGiftCardStoreConfig(store_view: 1) {
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
`

const useStoreConfig = () => {
    const storeConfig = useQuery(GET_GIFT_CARD_CONFIG, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-and-network'
    })

    return storeConfig
}

export default useStoreConfig