import gql from 'graphql-tag';

import { PricesFragment } from './PricesFragment.gql';

export const WishlistFragment = gql`
    fragment WishlistFragment on Wishlist {
        id
        items_count
        sharing_code
        updated_at
        items {
            id
            qty
            description
            added_at
            product {
                # id
                # sku
                # name

                # url_key
                # small_image {
                #     url
                #     label
                #     __typename
                # }
                # type_id
                # special_price
                # special_from_date
                # special_to_date
                # stock_status
                id
                name
                sku
                small_image {
                    url
                    label
                }
                thumbnail {
                    url
                    label
                }
                description {
                    html
                }
                short_description {
                    html
                }
                url_key
                special_price
                special_from_date
                type_id
                special_to_date
                stock_status
                price {
                    ...PricesFragment
                }

                ... on CustomizableProductInterface {
                    options {
                        option_id
                        required
                    }
                }
                ... on DownloadableProduct {
                    links_purchased_separately
                }
                rating_summary
                review_count
            }
        }
    }
    ${PricesFragment}
`;
