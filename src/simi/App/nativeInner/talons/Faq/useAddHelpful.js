import { useMutation } from '@apollo/client';
import { ADD_HELPFUL } from './Faq.gql';

export const useAddHelpful = props => {
	const { isHelpful } = props;
	const {
		data: helpfulData,
		loading: helpfulLoading,
		error: helpfulError
	} = useMutation(ADD_HELPFUL, {
		variable: { isHelpful: isHelpful }
	})
	
}