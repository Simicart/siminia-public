import { useMutation } from '@apollo/client';
import { REMOVE_GIFT_CARD_FROM_LIST } from './GiftCard.gql';

export const removeGiftCardFromList = props => {
	const [removeGiftCard, { loading: removeGcLoading, data: removeGcData, error: removeGcError }] = useMutation(REMOVE_GIFT_CARD_FROM_LIST)

	let removeGcErrorMessage;
   	if (removeGcError) {
       const errorTarget = removeGcError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           removeGcErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           removeGcErrorMessage = errorTarget.message;
       }
   	}
 
	return {
	    removeGiftCard,
	    removeGcLoading,
	    removeGcData,
	    removeGcErrorMessage
	}
}