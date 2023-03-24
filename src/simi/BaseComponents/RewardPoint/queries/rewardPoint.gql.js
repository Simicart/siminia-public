import gql from 'graphql-tag';

export const APPLY_REWARD_POINT = gql`
    mutation applyRewardPoint(
        $cartId: String,
        $amount: Int
    ) {
        applyRewardPoint(
            input: {
                cart_id: $cartId
                amount: $amount
            }
        ) {
            cart {
                success
                error_message
            }
        }
    }
`

export const GET_REWARD_POINT_EXCHANGE_RATE = gql`
    query getRewardPointsExchangeRate { 
        bssRewardPointsExchangeRate {
            currency_to_point_rate
            point_rate_to_currency
        }
    }
`

export default {
    applyRewardPointMutation: APPLY_REWARD_POINT,
    getRewardPointExchangeRate: GET_REWARD_POINT_EXCHANGE_RATE
}