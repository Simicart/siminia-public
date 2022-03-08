import SIGNIN_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql.js';
import { GET_CART_DETAILS_QUERY as getCartDetailsQuery } from '@magento/venia-ui/lib/components/SignIn/signIn.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import { useEventListener } from '@magento/peregrine';

export const useSignInEvent = (props = {}) => {
  const { handleErrors } = props;
  const operations = mergeOperations(SIGNIN_OPERATIONS, props.operations);

  const {
    createCartMutation,
    getCustomerQuery,
    mergeCartsMutation
  } = operations;

  const apolloClient = useApolloClient();
  const [{ isSignedIn }] = useUserContext();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [
    { cartId },
    { createCart, removeCart, getCartDetails }
  ] = useCartContext();

  const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

  const [fetchCartId] = useMutation(createCartMutation);
  const [mergeCarts] = useMutation(mergeCartsMutation);
  const fetchUserDetails = useAwaitQuery(getCustomerQuery);
  const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

  const socialLoginEventHandler = useCallback(
    async event => {
      setIsSigningIn(true);

      try {
        if (isSignedIn) {
          return null;
        }

        const { token, result, messages, redirect_data } = event.data || {};

        if (result === 1 && token) {
          const sourceCartId = cartId;

          await setToken(token);

          // Clear all cart/customer data from cache and redux.
          await clearCartDataFromCache(apolloClient);
          await clearCustomerDataFromCache(apolloClient);
          await removeCart();
          // Create and get the customer's cart id.
          await createCart({
            fetchCartId
          });
          const destinationCartId = await retrieveCartId();

          // Merge the guest cart into the customer cart.
          await mergeCarts({
            variables: {
              destinationCartId,
              sourceCartId
            }
          });

          // Ensure old stores are updated with any new data.
          getUserDetails({ fetchUserDetails });
          getCartDetails({ fetchCartId, fetchCartDetails });
        } else if (result === 0) {
          handleErrors({
            message: messages[0] || null,
            redirectWithError: redirect_data && redirect_data.redirectWithError
          });
        }

        setIsSigningIn(false);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error);
        }

        setIsSigningIn(false);
      }
    },
    [
      cartId,
      apolloClient,
      removeCart,
      setToken,
      createCart,
      fetchCartId,
      mergeCarts,
      getUserDetails,
      fetchUserDetails,
      getCartDetails,
      fetchCartDetails,
      isSignedIn,
      handleErrors
    ]
  );

  useEventListener(window, 'message', socialLoginEventHandler);

  return {
    isBusy: isGettingDetails || isSigningIn
  };
};
