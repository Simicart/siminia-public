import gql from 'graphql-tag';
import { CategoryFragment, ProductOfListFragment } from './catalogFragment.gql';

export const getCateNoFilter = gql`
    query getCateNoFilter(
        $id: Int
        $pageSize: Int
        $currentPage: Int
        $filters: ProductAttributeFilterInput
        $sort: ProductAttributeSortInput
    ) {
        category(id: $id) {
            ...CategoryFragment
        }
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                ...ProductOfListFragment
                mp_label_data {
                list_position
                list_position_grid
                label_image
                rule_id
                label_font
                label_font_size
                label_color
                label_template
                priority
                label
                list_css
                
            }
            }
            page_info {
                total_pages
            }
            total_count
        }
    }

    ${CategoryFragment}
    ${ProductOfListFragment}
`;

export const getFilterFromCate = gql`
    query getFilterFromCate($stringId: String) {
        products(filter: { category_id: { eq: $stringId } }) {
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
