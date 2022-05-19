import { useMutation } from '@apollo/client';
import { ADD_GIFT_CARD_TO_LIST } from './GiftCard.gql';

export const addGiftCardToList = props => {
	const [addGiftCard, { loading: addGcLoading, data: addGcData, error: addGcError }] = useMutation(ADD_GIFT_CARD_TO_LIST)

	let addGcErrorMessage;
   	if (addGcError) {
       const errorTarget = addGcError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           addGcErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           addGcErrorMessage = errorTarget.message;
       }
   	}
 
	return {
		addGiftCard,
	  addGcLoading,
	  addGcData,
	  addGcErrorMessage
	}
}