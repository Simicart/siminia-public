import { useQuery } from '@apollo/client';
import { GET_SEARCH_BOX } from './Faq.gql';

export const useSearchBox = props => {
	const {
		data: searchboxData,
		loading: searchboxLoading,
		error: searchboxError
	} = useQuery(GET_SEARCH_BOX,{fetchPolicy:"no-cache"})

	let derivedErrorMessage;
   	if (searchboxError) {
       const errorTarget = searchboxError;
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
		searchboxData,
		searchboxLoading,
		derivedErrorMessage
	}
}