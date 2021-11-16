import { useCallback } from 'react';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';

export const useSubscribeEmail = props => {

    const { query: { subscribeMutation } } = props;

    const [
        setSubscribe,
        { data: subscribed, error: subscribeError, loading: isSubmitting }
    ] = useMutation(subscribeMutation);

    const handleSubscribe = useCallback(
        async formValues => {
            showFogLoading();
            try {
                await setSubscribe({
                    variables: formValues
                });
            } catch {
                // we have an onError link that logs errors, and FormError already renders this error, so just return
                // to avoid triggering the success callback
                return;
            }
            hideFogLoading();
        }, [setSubscribe]);

    const isSuccess = subscribed ? subscribed.subscribe.message : null;

    return {
        subscribeError,
        isSubmitting,
        handleSubscribe,
        isSuccess
    };
}
