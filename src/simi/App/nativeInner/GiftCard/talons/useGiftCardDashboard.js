import { useQuery } from '@apollo/client';
import { GET_GIFT_CARD_DASHBOARD_CONFIG } from './GiftCard.gql';

export const useGiftCardDashboard = props => {
	const {
		data: gcDashboardData,
		loading: gcDashboardLoading,
		error: gcDashboardError,
    refetch: gcDashboardRefetch
	} = useQuery(GET_GIFT_CARD_DASHBOARD_CONFIG)

	let derivedErrorMessage;
   	if (gcDashboardError) {
       const errorTarget = gcDashboardError;
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
		gcDashboardData,
		gcDashboardLoading,
		derivedErrorMessage,
    gcDashboardRefetch
	}
}