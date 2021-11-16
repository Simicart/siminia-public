import gql from 'graphql-tag';

export const PricesFragment = gql`
    fragment PricesFragment on ProductPrices {
        regularPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
        minimalPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
        maximalPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
    }
`;