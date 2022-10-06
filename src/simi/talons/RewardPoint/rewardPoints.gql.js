import { gql } from '@apollo/client';
// import {PriceSummaryFragment} from "../override/CartPage/PriceSummary/priceSummaryFragment";
export const RewardPointsFragment = gql`
    fragment RewardPointsFragment on RewardConfig {
        spending {
            discount_label
            maximum_point_per_order
            minimum_balance
            restore_point_after_refund
            spend_on_ship
            spend_on_tax
            use_max_point
        }
        display {
            mini_cart
            top_page
        }
        earning {
            earn_from_tax
            earn_shipping
            point_refund
            round_method
            sales_earn {
                earn_point_after_invoice_created
                point_expired
            }
        }
        general {
            account_navigation_label
            display_point_label
            enabled
            icon
            maximum_point
            plural_point_label
            point_label
            show_point_icon
            zero_amount
        }
    }
`;

export const GET_REWARD_POINTS_CONFIG = gql`
    query getRewardPointsConfig {
        MpRewardConfig {
            ...RewardPointsFragment
        }
    }
    ${RewardPointsFragment}
`;


export const GET_CUSTOMER_REWARD_POINTS = gql`
        query getCustomerRewardPoints {
            customer {
                mp_reward {
                    reward_id
                    refer_code
                    point_balance
                    customer_id
                    point_spent
                    point_earned
                    point_balance
                    notification_update
                    notification_expire
                    balance_limitation
                    earn_point_expire
                    current_exchange_rates {
                        earning_rate
                        spending_rate
                    }
                    transactions {
                        total_count
                        items {
                            transaction_id
                            reward_id
                            customer_id
                            action_code
                            action_type
                            store_id
                            point_amount
                            point_remaining
                            point_used
                            status
                            order_id
                            created_at
                            expiration_date
                            expire_email_sent
                            comment
                        }
                    }
                }
                email
            }
        }
    `;

export const SET_REWARD_SUBSCRIBE_STATUS = gql`
    mutation setRewardSubscribeStatus(
        $isUpdate: Boolean!,
        $isExpire: Boolean!
    ) {
        MpRewardSubscribe(
            input: {
                isUpdate: $isUpdate,
                isExpire: $isExpire,
            }
        ) @connection(key: "Subscribe")
    }
`;
export const GET_CUSTOMER_TRANSACTION = gql`
    query getCustomerTransaction($pageSize: Int!) {
        customer {
            mp_reward {
                transactions(pageSize: $pageSize) {
                    total_count
                    items {
                        transaction_id
                        reward_id
                        customer_id
                        action_code
                        action_type
                        store_id
                        point_amount
                        point_remaining
                        point_used
                        status
                        order_id
                        created_at
                        expiration_date
                        expire_email_sent
                        comment
                    }
                }
            }
        }
    }
`;

export const SPEND_REWARD_POINT = gql`
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
