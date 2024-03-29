import { gql } from '@apollo/client';

export const GET_CATEGORY_LIST = gql`
    query GetCategoryList($id: Int!) {
        category(id: $id) {
            id
            children {
                id
                cms_block {
                    content
                    identifier
                    title
                }
                description
                display_mode
                products(pageSize: 6) {
                    total_count
                    items {
                        name
                        image {
                            url
                            label
                        }
                        special_price
                        url_key
                        url_suffix
                    }
                }
                name
                url_key
                url_path
                url_suffix
                children_count
                path
                image
                children {
                    name
                    url_suffix
                    url_key
                    url_path
                    image
                    products(pageSize: 1) {
                        items {
                            name
                            image {
                                url
                                label
                            }
                            url_key
                            url_suffix
                        }
                    }
                }
                productImagePreview: products(pageSize: 1) {
                    items {
                        id
                        small_image {
                            url
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getCategoryListQuery: GET_CATEGORY_LIST
};
