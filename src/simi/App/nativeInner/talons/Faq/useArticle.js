import { useQuery } from '@apollo/client';
import { GET_ARTICLE_BY_URL } from './Faq.gql';

export const useArticle = props => {
  const { url_key } = props
	const {
		data: articleData,
		loading: articleLoading,
		error: articleError
	} = useQuery(GET_ARTICLE_BY_URL, {
    variables:{ urlKey: url_key },
    fetchPolicy:"no-cache"
  })
	let derivedErrorMessage;
   	if (articleError) {
       const errorTarget = articleError;
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
		articleData,
		articleLoading,
		derivedErrorMessage
	}
}