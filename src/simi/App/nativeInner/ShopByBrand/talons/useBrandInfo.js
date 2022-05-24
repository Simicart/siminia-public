import { useQuery } from '@apollo/client';
import { GET_BRAND_INFO } from './Brand.gql';

const shopByBrandEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_SHOP_BY_BRAND) === 1;

export const useBrandInfo = props => {
    const { url_key } = props;
    const {
        data: brandInfo,
        loading: brandInfoLoading,
        error: brandInfoError
    } = useQuery(GET_BRAND_INFO, {
        variables: {
            urlKey: url_key
        },
        skip: !shopByBrandEnabled
    });
    let derivedErrorMessage;
    if (brandInfoError) {
        const errorTarget = brandInfoError;
        if (errorTarget.graphQLErrors) {
            // Apollo prepends "GraphQL Error:" onto the message,
            // which we don't want to show to an end user.
            // Build up the error message manually without the prepended text.
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message }) => message)
                .join(', ');
        } else {
            // A non-GraphQL error occurred.
            derivedErrorMessage = errorTarget.message;
        }
    }
    return {
        brandInfo,
        brandInfoLoading,
        derivedErrorMessage
    };
};
