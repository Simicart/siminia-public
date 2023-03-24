import { gql } from '@apollo/client';
import { ProductOfListFragment, SimiPriceFragment } from "src/simi/queries/catalog_gql/catalogFragment.gql";


export const SimiProductInterfaceFragment = gql`
    fragment SimiProductInterfaceFragment on ProductInterface {
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
    ${SimiPriceFragment}
`;

// note: if reuse SimiProductInterfaceFragment, gallery will return empty array
export const GET_PRODUCT_UPSELL_CROSSSELL_QUERY = gql`
    query getProductUpsellCrosssell($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                upsell_products {
                    ...on ConfigurableProduct {
                        configurable_options {
                            attribute_code
                            attribute_id
                            id
                            label
                            values {
                                default_label
                                store_label
                                label
                                swatch_data {
                                    value
                                }
                                uid
                                use_default_value
                            }
                        }
                    }
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
                crosssell_products{
                    ...on ConfigurableProduct {
                        configurable_options {
                            attribute_code
                            attribute_id
                            id
                            label
                            values {
                                default_label
                                store_label
                                label
                                swatch_data {
                                    value
                                }
                                uid
                                use_default_value
                            }
                        }
                    }
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
