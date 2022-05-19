import { useMutation } from '@apollo/client';
import { REMOVE_GIFT_CARD_CODE_FROM_CART } from './GiftCard.gql';

export const removeGiftCardCodeFromCart = props => {
	const [
    removeGiftCardCode, 
    { loading: removeCodeLoading, data: removeCodeData, error: removeCodeError }
  ] = useMutation(REMOVE_GIFT_CARD_CODE_FROM_CART)

	let removeCodeErrorMessage;
   	if (removeCodeError) {
       const errorTarget = removeCodeError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           removeCodeErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           removeCodeErrorMessage = errorTarget.message;
       }
   	}
 
	return {
		removeGiftCardCode,
	  removeCodeLoading,
	  removeCodeData,
	  removeCodeErrorMessage
	}
}