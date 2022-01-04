import { gql } from '@apollo/client';

export const GET_CUSTOMER_REVIEWS = gql`
    query getCustomerReview(
        $currentPage: Int!
        $pageSize: Int!
    ) {
        customer {
            reviews(currentPage: $currentPage, pageSize: $pageSize) {
                items {
                    summary
                    text
                    nickname
                    created_at
                    average_rating
                    product {
                        uid
                        name
                        url_key
                        url_suffix
                        image {
                          url
                        }
                      }
                }
                page_info {
                    current_page
                    total_pages
                }
            }
        }
    }
`;

