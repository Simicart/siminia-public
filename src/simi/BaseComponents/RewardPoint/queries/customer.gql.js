import gql from 'graphql-tag';

export const GET_CUSTOMER_REWARD_POINT = gql`
    query getCustomerRewardPoint {
        customer {
            reward_point {
                point
                point_used
                point_expired
                amount
                notify_balance
                notify_expiration
                rate_point
                subscribe_point {
                    point
                    message
                }
                first_review_point
                birth_day_point
            }
        }
    }
`;

export const GET_REWARD_POINTS_TRANSACTION = gql`
    query getRewardPointsTransaction($currentPage: Int, $pageSize: Int) {
        bssRewardPointsTransaction(
            currentPage: $currentPage, 
            pageSize: $pageSize
        ) {
            total_page
            items {
                transaction_id
                balance
                website_id
                customer_id
                point
                point_used
                point_expired
                amount
                base_currrency_code
                basecurrency_to_point_rate
                action_id
                action
                created_at
                note
                created_by
                is_expired
                expires_at
            }
        }
    }
`

export const UPDATE_NOTIFYCATION = gql`
    mutation updateNotify(
        $notifyBalance: Int
        $notifyExpiration: Int
    ) {
        updateNotify(
            input: {
                notify_balance: $notifyBalance
                notify_expiration: $notifyExpiration
            }
        ) {
            status {
                success
                message
            }
        }
    }
`

export default {
    getCustomerRewardPoint: GET_CUSTOMER_REWARD_POINT,
    getRewardPointsTransaction: GET_REWARD_POINTS_TRANSACTION,
    updateNotifycationMutation: UPDATE_NOTIFYCATION
}