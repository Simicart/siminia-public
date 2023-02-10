import { gql } from '@apollo/client';

const SUBMIT_PREVIEW = gql`
    mutation createReview($input: CreateProductReviewInput!) {
        createProductReview(input: $input) {
            review {
                ratings_breakdown {
                    name
                    value
                }
            }
        }
    }
`

export default SUBMIT_PREVIEW