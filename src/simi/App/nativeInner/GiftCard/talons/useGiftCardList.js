import { useQuery } from '@apollo/client';
import { GET_GIFT_CARD_LIST } from './GiftCard.gql';

export const useGiftCardList = props => {
	const {
		data: giftCardListData,
		loading: giftCardListLoading,
		error: giftCardListError,
	} = useQuery(GET_GIFT_CARD_LIST)

	let derivedErrorMessage;
   	if (giftCardListError) {
       const errorTarget = giftCardListError;
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
		giftCardListData,
		giftCardListLoading,
		derivedErrorMessage
	}
}