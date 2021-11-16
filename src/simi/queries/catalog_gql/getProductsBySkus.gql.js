import gql from 'graphql-tag';
import { ProductOfListFragment } from './catalogFragment.gql';

export const GET_PRODUCTS_BY_SKUS = gql`
    query getProductsBySkus(
        $pageSize: Int
        $currentPage: Int
        $stringSku: [String]
        $sort: ProductAttributeSortInput
    ) {
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: { sku: { in: $stringSku } }
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
