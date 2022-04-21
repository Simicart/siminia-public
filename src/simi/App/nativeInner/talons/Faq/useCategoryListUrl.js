import { useQuery } from '@apollo/client';
import { GET_CATEGORY_LIST } from './Faq.gql';

export const useCategoryListUrl = props => {
    const { url_key } = props
	const {
		data: categoryData,
		loading: categoryLoading,
		error: categoryError
	} = useQuery(GET_CATEGORY_LIST, {
        variables:{ urlKey: url_key }
    })

	let derivedErrorMessage;
 	if (categoryError) {
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
		categoryData,
		categoryLoading,
		derivedErrorMessage
	}
}
