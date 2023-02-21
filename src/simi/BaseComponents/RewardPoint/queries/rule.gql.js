import gql from 'graphql-tag';

export const GET_RULE_REWARD_POINT = gql`
    query getBssRewardPointsRule {
        bssRewardPointsRule {
            rules {
                rule_id
                name
                type
                from_date
                to_date
                conditions_serialized
                actions_serialized
                product_ids
                priority
                simple_action
                point
                purchase_point
                spent_amount
            }
        }
    }
`;

export default {
    getRuleRewardPoint: GET_RULE_REWARD_POINT,
}