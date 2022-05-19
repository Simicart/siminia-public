import { useMutation } from '@apollo/client';
import { SET_GIFT_CARD_CREDIT_TO_CART, GET_USED_GIFT_CARD } from './GiftCard.gql';

export const setGiftCardCreditToCart = props => {
	const [
    setGiftCardCredit, 
    { loading: setCreditLoading, data: setCreditData, error: setCreditError }
  ] = useMutation(SET_GIFT_CARD_CREDIT_TO_CART)

	let setCreditErrorMessage;
   	if (setCreditError) {
       const errorTarget = setCreditError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           setCreditErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           setCreditErrorMessage = errorTarget.message;
       }
   	}
 
	return {
		setGiftCardCredit,
	  setCreditLoading,
	  setCreditData,
	  setCreditErrorMessage
	}
}