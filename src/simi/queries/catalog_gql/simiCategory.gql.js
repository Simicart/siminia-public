import gql from 'graphql-tag';
import { CategoryFragment, ProductOfListFragment } from './catalogFragment.gql';

export const getCateNoFilter = gql`
    query getCateNoFilter(
        $id: Int!
        $currentPage: Int
        $pageSize: Int
        $stringId: String
        $sort: ProductAttributeSortInput
        $simiFilter: String
        $simiProductSort: SimiProductSort
    ) {
        category(id: $id) {
            ...CategoryFragment
            children {
                id
                name
            }
        }
        simiproducts(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: { category_id: { eq: $stringId } }
            sort: $sort
            simiFilter: $simiFilter
            simiProductSort: $simiProductSort
            simiNoFilter: true
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
    ${CategoryFragment}
    ${ProductOfListFragment}
`;

export const getFilterFromCate = gql`
    query getFilterFromCate(
        $currentPage: Int
        $pageSize: Int
        $stringId: String
        $sort: ProductAttributeSortInput
        $simiFilter: String
    ) {
        simiproducts(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: { category_id: { eq: $stringId } }
            sort: $sort
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
