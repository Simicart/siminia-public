import gql from 'graphql-tag';
const shopByBrandEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND) === 1;

export const BrandFragment = shopByBrandEnabled ? gql`
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
`: '';
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
export const CategoryFragment = shopByBrandEnabled ?  gql`
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
` : '';

export const GET_BRANDS_LIST = gql`
    query mpbrand($pageSize: Int!, $currentPage: Int) {
        mpbrand(filter: {}, pageSize: $pageSize, currentPage: $currentPage) {
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
    query mpbrand($url_key: String!) {
        mpbrand(filter: { url_key: { eq: $url_key } }) {
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

export const SimiPriceFragment = gql`
    fragment SimiPriceFragment on ProductPrices {
        regularPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
        minimalPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
        maximalPrice {
            amount {
                currency
                value
            }
            adjustments {
                amount {
                    currency
                    value
                }
                code
                description
            }
        }
    }
`;

export const ProductOfListFragment = gql`
    fragment ProductOfListFragment on ProductInterface {
        id
        name
        sku
        small_image {
            url
            label
        }
        media_gallery_entries {
            label
            position
            disabled
            file
        }
        url_key
        special_price
        special_from_date
        type_id
        special_to_date
        stock_status
        price {
            ...SimiPriceFragment
        }
        price_tiers {
            quantity
            final_price {
                value
                currency
            }
        }
        rating_summary
        review_count
        ... on CustomizableProductInterface {
            options {
                title
            }
        }
    }
    ${SimiPriceFragment}
`;

export const GET_BRAND_PRODUCTS = gql`
    query getBrandProducts(
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        products(
            pageSize: $pageSize
            currentPage: $currentPage
            filter: $filters
            sort: $sort
        ) {
            items {
                # id is always required, even if the fragment includes it.
                id
                # TODO: Once this issue is resolved we can use a
                # GalleryItemFragment here:
                # https://github.com/magento/magento2/issues/28584
                ...ProductOfListFragment
                name
                mpbrand {
                    attribute_id
                    brand_id
                    default_value
                    image
                    description
                }
                price {
                    regularPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                small_image {
                    url
                }
                url_key
                url_suffix
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
    ${ProductOfListFragment}
`;
