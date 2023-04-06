import { gql , useQuery} from '@apollo/client';
// import { useQuery } from '@apollo/client';

const productLabelEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_PRODUCT_LABEL) === 1;

const ItemFragment = gql`
    fragment ItemFragment on ProductInterface {
        id
        name
        sku
        small_image {
            url
            label
            __typename
        }
                ${
                    productLabelEnabled
                        ? `
                        product_label {
                            name
                            image
                            image_data {
                                left
                                top
                                width
                                height
                                widthOrigin
                                heightOrigin
                                angle
                            }
                        }
                `
                        : ``
                }
        thumbnail {
            url
            label
            __typename
        }
        short_description {
            html
            __typename
        }
        url_key
        url_suffix
        special_price
        special_from_date
        type_id
        special_to_date
        stock_status
        price {
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
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
                label
                values {
                    default_label
                    label
                    store_label
                    use_default_value
                    value_index
                    swatch_data {
                        ... on ImageSwatchData {
                            thumbnail
                        }
                        value
                    }
                }
            }
            variants {
                attributes {
                    code
                    value_index
                }
                product {
                    id
                    media_gallery_entries {
                        id
                        disabled
                        file
                        label
                        position
                    }
                    sku
                    stock_status
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                }
            }
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
`;

const GET_PRODUCTS = gql`
    query getProducts(
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
            total_count
            items {
                ...ItemFragment
            }
            page_info {
                total_pages
            }
        }
    }
    ${ItemFragment}
`;

export const useProducts = props => {
    const { filterData, pageSize, sortData } = props;
    const variables = {
        currentPage: 1,
        pageSize: pageSize ? pageSize : 12,
        filters: filterData
    };
    if (sortData) variables.sort = sortData;
    const result = useQuery(GET_PRODUCTS, {
        variables,
        fetchPolicy: 'cache-first'
    });
    const { data, loading } = result;
    return {
        data,
        loading
    };
};
