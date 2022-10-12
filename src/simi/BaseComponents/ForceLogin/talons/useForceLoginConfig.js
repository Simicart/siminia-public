import { useQuery } from '@apollo/client';
import GET_MODULE_CONFIG from '@bsscommerce/force-login/src/queries/getModuleConfigQuery';

export default props => {
    const { data, loading, error } = useQuery(GET_MODULE_CONFIG);

    return {
        moduleConfig: data?.bssForceLoginConfig,
        loading,
        error: error && handleError(error)
    }
}

const handleError = (error) => {
    const errorTarget = error;
    let derivedErrorMessage;
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
    return derivedErrorMessage;
}
