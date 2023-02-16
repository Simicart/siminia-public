import { useMutation } from '@apollo/client';
import { ADD_VOTE_FAQ } from './Faq.gql';

export const useVoteFaq = props => {
    const [addVoteFaq, { data }] = useMutation(ADD_VOTE_FAQ);
    return { addVoteFaq, voteData: data };
};
