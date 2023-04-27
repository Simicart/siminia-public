import { ProductCustomAttributesFragment } from '../../RootComponents/Product/productDetailFragment.gql'
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';
import Identify from 'src/simi/Helper/Identify';
import gql from 'graphql-tag';


const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                ...ProductCustomAttributesFragment
            }
        }
    }
    ${ProductCustomAttributesFragment}
`;

export const useCustomAttributes = props => {
    const { urlKey } = props

    const { error, loading, data } = useQuery(GET_PRODUCT_DETAIL_QUERY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKey: urlKey
        }
    });

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(
            item => item.url_key === urlKey
        );

        if (!product) {
            if (data.products.items && data.products.items.length)
                return data.products.items[0];
            return null;
        }

        return mapProduct(product);
    }, [data, mapProduct, urlKey]);
    return {
        error,
        loading,
        product
    };
}
