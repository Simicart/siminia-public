import gql from 'graphql-tag';
import { ProductOfListFragment } from './catalogFragment.gql';

export const getSearchNoFilter = gql`
    query getSearchNoFilter(
        $inputText: String
        $currentPage: Int
        $pageSize: Int
        $simiProductSort: SimiProductSort
        $simiFilter: String
        $sort: ProductAttributeSortInput
    ) {
        simiproducts(
            search: $inputText
            pageSize: $pageSize
            currentPage: $currentPage
            sort: $sort
            simiProductSort: $simiProductSort
            simiFilter: $simiFilter
        ) {
            items {
                ...ProductOfListFragment
            }
            page_info {
                total_pages
            }
            total_count
            minPrice
            maxPrice
        }
    }
    ${ProductOfListFragment}
`;

export const getFilterFromSearch = gql`
    query getFilterFromSearch(
        $inputText: String
        $currentPage: Int
        $pageSize: Int
        $simiProductSort: SimiProductSort
        $simiFilter: String
        $sort: ProductAttributeSortInput
    ) {
        simiproducts(
            search: $inputText
            pageSize: $pageSize
            currentPage: $currentPage
            sort: $sort
            simiProductSort: $simiProductSort
            simiFilter: $simiFilter
        ) {
            simi_filters {
                name
                filter_items_count
                request_var
                filter_items {
                    label
                    value_string
                    items_count
                }
            }
            sort_fields {
                default
                options {
                    value
                    label
                }
            }
        }
    }
`;
