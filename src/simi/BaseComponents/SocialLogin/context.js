import React, { createContext, useContext } from 'react';
import { useSocialLogin } from './talons/useSocialLogin';
import { useSignInEvent } from './talons/useSignInEvent';

const AmSocialLoginContext = createContext();
const { Provider } = AmSocialLoginContext;

const AmAdvancedReviewsProvider = props => {
    const { children } = props;

    const talonProps = useSocialLogin();
    const { error, needRedirect, redirectUrl, handleErrors } = talonProps;
    const { isBusy } = useSignInEvent({
        needRedirect,
        redirectUrl,
        handleErrors
    });

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }

    const contextValue = {
        ...talonProps,
        isBusy
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

export default AmAdvancedReviewsProvider;

export const useSocialLoginContext = () => useContext(AmSocialLoginContext);
