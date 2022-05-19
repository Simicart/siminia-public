import { useMutation } from '@apollo/client';
import { SET_GIFT_CARD_CODE_TO_CART } from './GiftCard.gql';

export const setGiftCardCodeToCart = props => {
	const [
    setGiftCardCode, 
    { loading: setCodeLoading, data: setCodeData, error: setCodeError }
  ] = useMutation(SET_GIFT_CARD_CODE_TO_CART)

	let setCodeErrorMessage;
   	if (setCodeError) {
       const errorTarget = setCodeError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           setCodeErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           setCodeErrorMessage = errorTarget.message;
       }
   	}
 
	return {
		setGiftCardCode,
	  setCodeLoading,
	  setCodeData,
	  setCodeErrorMessage
	}
}