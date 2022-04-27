import { useLazyQuery } from '@apollo/client';
import { CHECK_GIFT_CARD_CODE } from './GiftCard.gql';

export const checkGiftCardCode = props => {
	const [checkCode, { loading: checkCodeLoading, data: checkCodeData, error: checkCodeError }] = useLazyQuery(CHECK_GIFT_CARD_CODE)
 
	let checkCodeErrorMessage;
   	if (checkCodeError) {
       const errorTarget = checkCodeError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           checkCodeErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           checkCodeErrorMessage = errorTarget.message;
       }
   	}

	return {
		checkCode,
	    checkCodeLoading,
	    checkCodeData,
	    checkCodeErrorMessage
	}
}