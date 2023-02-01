import React, { createContext, useContext } from 'react';
import { useCallForPrice } from './talons/useCallForPrice';

const CallForPriceContext = createContext();
const { Provider } = CallForPriceContext;

const CallForPriceProvider = props => {
    const { children } = props;

    const talonProps = useCallForPrice();
    const { error } = talonProps;

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }

    const contextValue = {
        ...talonProps
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

export default CallForPriceProvider;

export const useCallForPriceContext = () => useContext(CallForPriceContext);
