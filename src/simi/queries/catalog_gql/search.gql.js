import gql from 'graphql-tag';
import { ProductOfListFragment } from './catalogFragment.gql';

export const getSearchNoFilter = gql`
    query getSearchNoFilter(
        $inputText: String
        $pageSize: Int
        $currentPage: Int
        $filters: ProductAttributeFilterInput
        $sort: ProductAttributeSortInput
    ) {
        products(
            search: $inputText
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                ...ProductOfListFragment
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
    ${ProductOfListFragment}
`;

export const getFilterFromSearch = gql`
    query getFilterFromSearch($inputText: String) {
        products(
            search: $inputText
        ) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
            }
        }
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;
