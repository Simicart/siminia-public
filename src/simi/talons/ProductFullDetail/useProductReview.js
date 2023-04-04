import operations from './productFullDetailReviews.gql';
import { useQuery, useMutation } from '@apollo/client';
import { useIntl } from 'react-intl';
import { useToasts } from '@magento/peregrine';

const useProductReview = props => {
    const { product, setIsOpen, enabledReview } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const { getAllReviews, createProductReview } = operations;
    const { data, loading } = useQuery(getAllReviews, {
        fetchPolicy: 'network-only',
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
                    id:
                        "Guest customers aren't allowed to add product reviews.",
                    defaultMessage:
                        "Guest customers aren't allowed to add product reviews."
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
        submitReview,
        submitReviewCalled
    };
};
export default useProductReview;
