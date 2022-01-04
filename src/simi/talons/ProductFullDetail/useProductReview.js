import operations from './productFullDetailReviews.gql';
import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';

const useProductReview = props => {
    const { product, setIsOpen, enabledReview, enabledGuestReview } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const { getAllReviews, createProductReview } = operations;
    const { data, error, loading } = useQuery(getAllReviews, {
        fetchPolicy: 'cache-and-network',
        skip: !enabledReview,
        variables: {
            sku: product.sku
        }
    });
    const [
        submitReview,
        { called: submitReviewCalled, loading: submitReviewLoading }
    ] = useMutation(createProductReview, {
        onError: () => {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'Request Failed'
                }),
                timeout: 3000
            });
        },
        onCompleted: () => {
            addToast({
                type: 'info',
                message: formatMessage({
                    id: 'Successfully Saved'
                }),
                timeout: 3000
            });
            setIsOpen(false);
        }
    });
    return {
        data,
        loading,
        submitReviewLoading,
        submitReview
    };
};
export default useProductReview;
