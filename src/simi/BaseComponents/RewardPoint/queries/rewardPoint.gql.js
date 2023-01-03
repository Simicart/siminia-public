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

export default {
    applyRewardPointMutation: APPLY_REWARD_POINT
}