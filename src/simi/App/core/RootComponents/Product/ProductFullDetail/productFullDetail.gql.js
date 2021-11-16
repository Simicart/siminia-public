import gql from 'graphql-tag';

import { CartPageFragment } from 'src/simi/App/core/Cart/cartPageFragments.gql';

export const ADD_CONFIGURABLE_MUTATION = gql`
    mutation addConfigurableProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $parentSku: String!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_SIMPLE_MUTATION = gql`
    mutation addSimpleProductToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
    ) {
        addSimpleProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
            }
        ) @connection(key: "addSimpleProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_BUNDLE_MUTATION = gql`
    mutation addBundleProductsToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $bundleOptions: [BundleOptionInput!]!
    ) {
        addBundleProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        bundle_options: $bundleOptions
                    }
                ]
            }
        ) @connection(key: "addBundleProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_DOWNLOADABLE_MUTATION = gql`
    mutation addDownloadableProductsToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
        $downloadableProductLinks: [DownloadableProductLinksInput!]
    ) {
        addDownloadableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $sku }
                        downloadable_product_links: $downloadableProductLinks
                    }
                ]
            }
        ) @connection(key: "addDownloadableProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_DOWNLOADABLE_AND_CUSTOM_OPT_MUTATION = gql`
    mutation addDownloadableProductsToCart(
        $cartId: String!
        $data: [DownloadableProductCartItemInput]!
    ) {
        addDownloadableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: $data
            }
        ) @connection(key: "addDownloadableProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_GROUP_AND_CUSTOM_OPT_MUTATION = gql`
    mutation addSimpleProductToCart(
        $cartId: String!
        $data: [SimpleProductCartItemInput]!
    ) {
        addSimpleProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: $data
            }
        ) @connection(key: "addSimpleProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_VIRTUAL_MUTATION = gql`
    mutation addVirtualProductsToCart(
        $cartId: String!
        $quantity: Float!
        $sku: String!
    ) {
        addVirtualProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku } }]
            }
        ) @connection(key: "addVirtualProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const ADD_VIRTUAL_CUSTOM_OPT_MUTATION = gql`
    mutation addVirtualProductsToCart(
        $cartId: String!
        $data: [VirtualProductCartItemInput]!
    ) {
        addVirtualProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: $data
            }
        ) @connection(key: "addVirtualProductsToCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
