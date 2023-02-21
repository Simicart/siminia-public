// import React, { createContext, useContext } from 'react';
// import { useRewardPoint } from './talons/useRewardPoint';

// const BssRewardPointContext = createContext();
// const { Provider } = BssRewardPointContext;

// const BssRewardPointProvider = props => {
//     const { children } = props;

//     const talonProps = useRewardPoint();
//     const { error } = talonProps;

//     if (error) {
//         if (process.env.NODE_ENV !== 'production') {
//             console.error(error);
//         }
//     }

//     const contextValue = {
//         ...talonProps
//     };

//     return <Provider value={contextValue}>{children}</Provider>;
// };

// export default BssRewardPointProvider;

// export const useAmMegaMenuContext = () => useContext(BssRewardPointContext);
