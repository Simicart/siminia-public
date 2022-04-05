import { gql } from '@apollo/client';
import { PriceSummaryFragment } from './priceSummaryFragments.gql';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;
const GET_RULE_APPLY = gql`
    query MpRewardShoppingCartSpendingRules(
        $cartId: String!
    ){
        MpRewardShoppingCartSpendingRules(cart_id: $cartId){
            pointSpent
            ruleApplied
            rules{
                id
                label
                min
                max
                step
            }
        }
    }
`;
const SPEND_REWARD_POINT = gql`
    mutation(
         $cart_id: String!
         $points: Int!
         $rule_id: String!
         $address_information: AddressInformationInput!
    ) {
        MpRewardSpendingPoint(
                cart_id: $cart_id
                points: $points
                rule_id: $rule_id
                address_information: $address_information
        ){
            code
            title
            value
        }
    }
`;

export default {
    getPriceSummaryQuery: GET_PRICE_SUMMARY,
    getRuleApply: GET_RULE_APPLY,
    spendRewardPoint: SPEND_REWARD_POINT
};