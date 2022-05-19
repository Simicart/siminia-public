import { useMutation } from '@apollo/client';
import { REDEEM_GIFT_CARD } from './GiftCard.gql';

export const redeemGiftCard = props => {
	const [redeem, { loading: redeemLoading, data: redeemData, error: redeemError }] = useMutation(REDEEM_GIFT_CARD)

	let redeemErrorMessage;
   	if (redeemError) {
       const errorTarget = redeemError;
       if (errorTarget.graphQLErrors) {
           // Apollo prepends "GraphQL Error:" onto the message,
           // which we don't want to show to an end user.
           // Build up the error message manually without the prepended text.
           redeemErrorMessage = errorTarget.graphQLErrors
               .map(({ message }) => message)
               .join(', ');
       } else {
           // A non-GraphQL error occurred.
           redeemErrorMessage = errorTarget.message;
       }
   	}
 
	return {
		redeem,
	  redeemLoading,
	  redeemData,
	  redeemErrorMessage,
	}
}