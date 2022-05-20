import React, { createContext, useContext } from 'react';
import { useMegaMenu } from './talons/useMegaMenu';

const AmMegaMenuContext = createContext();
const { Provider } = AmMegaMenuContext;

const AmMegaMenuProvider = props => {
    const { children } = props;

    const talonProps = useMegaMenu();
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

export default AmMegaMenuProvider;

export const useAmMegaMenuContext = () => useContext(AmMegaMenuContext);
