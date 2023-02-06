import { useQuery } from '@apollo/client';
import { GET_TAG_FAQS } from './Faq.gql';

export const useTagList = props => {
    const { url_key } = props
    const {
        data: tagListData,
        loading: tagListLoading,
        error: tagListError
    } = useQuery(GET_TAG_FAQS, { 
        variables:{ tag_list: url_key, sort_by : "" },
        fetchPolicy:"no-cache"
    });
   
    let derivedErrorMessage;
    if (tagListError) {
        const errorTarget = tagListError;
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
        tagListData,
        tagListLoading,
        tagListError
    };
};
