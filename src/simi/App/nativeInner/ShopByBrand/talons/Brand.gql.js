import gql from 'graphql-tag';

export const BrandFragment = gql`
    fragment BrandFragment on MageplazaBrands {
        brand_id
        attribute_id
        option_id
        value
        default_value
        store_id
        page_title
        url_key
        image
        is_featured
        short_description
        description
        static_block
        meta_title
        meta_keywords
        meta_description
        product_quantity
    }
`
export const GET_BRAND_INFO = gql`
    query getBrandProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                mpbrand{
                    ...BrandFragment
                }
            }
            ${BrandFragment}
        }
    }
`;
export const CategoryFragment = gql`
    fragment CategoryFragment on MageplazaBrandsCategories {
        cat_id
        status
        store_ids
        name
        url_key
        meta_title
        meta_keywords
        meta_description
        meta_robots
        created_at
        updated_at
        mpbrand {
            ...BrandFragment
        }
    }
    ${BrandFragment}
`

export const GET_BRANDS_LIST = gql`
    query mpbrand (
        $pageSize : Int!,
        $currentPage : Int
    ) {
        mpbrand (
            filter : {}
            pageSize : $pageSize
            currentPage : $currentPage
        ) {
            items {
                ...BrandFragment
                mpbrandCategories {
                    cat_id
                    name
                    url_key
                }
            }
            total_count
        }
    }
    ${BrandFragment}
`;

export const GET_BRANDS_BY_URL = gql`
    query mpbrand (
        $url_key : String!
    ) {
        mpbrand (
            filter : {url_key : {eq: $url_key}}
        ) {
            items {
                ...BrandFragment
                mpbrandCategories {
                    cat_id
                    name
                    url_key
                }
            }
            total_count
        }
    }
    ${BrandFragment}
`;

export const GET_BRANDS_CATEGORY = gql`
    query mpbrandCategories {
        mpbrandCategories {
            ...CategoryFragment
        }
    }
    ${CategoryFragment}
`;