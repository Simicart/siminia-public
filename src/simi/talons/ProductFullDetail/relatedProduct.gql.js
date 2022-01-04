import {gql} from '@apollo/client';
import {SimiPriceFragment} from "src/simi/queries/catalog_gql/catalogFragment.gql";

export const GET_RELATED_PRODUCT_QUERY = gql`
    query getRelatedProduct($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                related_products{
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
                            }
                        }
                    }
    }
    ${SimiPriceFragment}
`;
