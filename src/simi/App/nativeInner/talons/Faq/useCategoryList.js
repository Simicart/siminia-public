import { useQuery } from '@apollo/client';
import { GET_CATEGORY_LIST } from './Faq.gql';

export const useCategoryList = props => {
	const {
		data: categoriesData,
		loading: categoriesLoading,
		error: categoriesError
	} = useQuery(GET_CATEGORY_LIST,{ fetchPolicy: 'no-cache' })

	let derivedErrorMessage;
 	if (categoriesError) {
     const errorTarget = categoryError;
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
		categoriesData,
		categoriesLoading,
		derivedErrorMessage
	}
}
