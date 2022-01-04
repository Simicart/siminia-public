import { gql } from '@apollo/client';

const GET_ALL_REVIEWS = gql`
    query getReviewsListOfProduct($sku: String!) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                uid
                options_container
                __typename
                name
                reviews(pageSize: 20, currentPage: 1) {
                    items {
                        summary
                        text
                        nickname
                        created_at
                        average_rating
                        ratings_breakdown {
                            name
                            value
                        }
                    }
                    page_info {
                        total_pages
                        current_page
                    }
                }
            }
        }
        productReviewRatingsMetadata {
            items {
                id
                name
                values {
                    value_id
                    value
                }
            }
        }
    }
`;

export const CREATE_PRODUCT_REVIEW = gql`
    mutation createProductReview($reviewInput: CreateProductReviewInput!) {
        createProductReview(input: $reviewInput)
            @connection(key: "createProductReview") {
            review {
                summary
                text
                nickname
                created_at
                average_rating
                ratings_breakdown {
                    name
                    value
                }
            }
        }
    }
`;

export default {
    getAllReviews: GET_ALL_REVIEWS,
    createProductReview: CREATE_PRODUCT_REVIEW
};
