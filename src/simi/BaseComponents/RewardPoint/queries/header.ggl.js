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
                subscribe_point
                first_review_point
                birth_day_point
            }
        }
    }
`;

export default {
    getCustomerRewardPoint: GET_CUSTOMER_REWARD_POINT
}