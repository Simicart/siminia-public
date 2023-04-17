import { useQuery } from '@apollo/client';
import { GET_FAQ_INFO_PRODUCT_DETAIL } from '../talons/Faq.gql';

const faqsEnabled =
    window.SMCONFIGS &&
    window.SMCONFIGS.plugins &&
    window.SMCONFIGS.plugins.SM_ENABLE_FAQS &&
    parseInt(window.SMCONFIGS.plugins.SM_ENABLE_FAQS) === 1;

export const useFaqProductDetail = props => {
    const { urlKey } = props;
    const {
        data: faqDetailData,
        loading: faqDetailLoading,
        error: faqDetailError,
    } = useQuery(GET_FAQ_INFO_PRODUCT_DETAIL, {
        variables: { urlKey: urlKey }, 
        fetchPolicy: 'no-cache',
        skip: faqsEnabled === 0
    });
    let derivedErrorMessage;
    if (faqDetailError) {
        const errorTarget = faqDetailError;
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
        faqDetailData,
        faqDetailLoading,
        faqDetailError,
    };
};
