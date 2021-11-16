import { useEffect, useState } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { simiUseMutation as useMutation, simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { useHistory } from 'react-router-dom';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from "src/simi/Helper/Identify";
import { smoothScrollToView } from 'src/simi/Helper/Behavior';

import {
    GET_WISHLIST,
    ADD_WISHLIST,
    ADD_WISHLIST_TO_CART,
    REMOVE_WISHLIST_ITEM
} from 'src/simi/App/core/Customer/Account/WishlistFragment/wishlistPage.gql';

export const useWishlist = props => {
    const { toggleMessages, showLoading } = props || {};
    const [data, setData] = useState(null);
    const isShowLoading = showLoading || true;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();

    const onError = errorTarget => {
        let derivedErrorMessage;
        if (errorTarget.graphQLErrors) {
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                .join(', ');
        } else {
            derivedErrorMessage = errorTarget.message;
        }
        if (derivedErrorMessage)
            toggleMessages([{ type: 'error', message: derivedErrorMessage, auto_dismiss: true }])
    }

    const {
        data: dataWishlist,
        loading: loadingGetWishlist,
        error: errorGetWishlist
    } = useQuery(GET_WISHLIST, { onError });

    const [addWishlistMutation, {
        data: dataAddWishlist,
        loading: loadingAddWishlist,
        error: errorAddWishlist
    }] = useMutation(ADD_WISHLIST, { onError });

    const [addWishlistToCart, {
        data: dataWishlistToCart,
        loading: loadingWishlistToCart,
        error: errorWishlistToCart
    }] = useMutation(ADD_WISHLIST_TO_CART, { onError });

    const [removeWishlistItem, {
        data: dataRemoveItem,
        loading: loadingRemoveItem,
        error: errorRemoveItem
    }] = useMutation(REMOVE_WISHLIST_ITEM, { onError });

    useEffect(() => {
        if (dataWishlist && dataWishlist.customer && dataWishlist.customer.wishlist) {
            setData(dataWishlist.customer.wishlist);
        }
    }, [dataWishlist]);

    useEffect(() => {
        if (dataAddWishlist && dataAddWishlist.wishlist) {
            setData(dataAddWishlist.wishlist);
            toggleMessages([{ type: 'success', message: Identify.__('This product has been added to wishlist'), auto_dismiss: true }]);
        }
    }, [dataAddWishlist, toggleMessages]);

    useEffect(() => {
        if (dataWishlistToCart && dataWishlistToCart.wishlistToCart) {
            setData(dataWishlistToCart.wishlistToCart.wishlist);
            smoothScrollToView($('#root'));
            toggleMessages([{ type: 'success', message: Identify.__('This product has been moved to cart'), auto_dismiss: true }]);
        }
    }, [dataWishlistToCart, toggleMessages]);

    useEffect(() => {
        if (dataRemoveItem && dataRemoveItem.wishlistRemoveItem) {
            setData(dataRemoveItem.wishlistRemoveItem);
            smoothScrollToView($('#root'));
            toggleMessages([{ type: 'success', message: Identify.__('This product has been moved from Wishlist'), auto_dismiss: true }]);
        }
    }, [dataRemoveItem, toggleMessages]);

    // Handle errors
    useEffect(() => {
        const errorTarget = errorGetWishlist || errorAddWishlist || errorWishlistToCart || errorRemoveItem
        let derivedErrorMessage
        if (errorTarget) {
            if (errorTarget.graphQLErrors) {
                derivedErrorMessage = errorTarget.graphQLErrors
                    .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                    .join(', ');
            } else {
                derivedErrorMessage = errorTarget.message;
            }
            if (derivedErrorMessage)
                toggleMessages([{ type: 'error', message: derivedErrorMessage, auto_dismiss: true }])
        }
    }, [errorGetWishlist, errorAddWishlist, errorWishlistToCart, errorRemoveItem, toggleMessages]);

    if (!isSignedIn) return {}; // Stop process if not logged in

    const isLoading = loadingGetWishlist || loadingAddWishlist || loadingWishlistToCart || loadingRemoveItem;

    if (isShowLoading) {
        if (isLoading) {
            showFogLoading();
        } else {
            hideFogLoading();
        }
    }

    /**
     *
     * @param {int} product id
     * @param {string} data json buyRequest
     */
    const addWishlist = (product, data = "{}") => {
        if (!isSignedIn) {
            showToastMessage(Identify.__('You are not logged in. Please log in first.'));
            history.push('/login.html');
            return;
        }
        addWishlistMutation({
            variables: {
                'product': product,
                'data': data
            }
        });
    }

    const addToCart = (id) => {
        if (!isSignedIn) {
            showToastMessage(Identify.__('You are not logged in. Please log in first.'));
            history.push('/login.html');
            return;
        }
        addWishlistToCart({
            variables: {
                'itemId': id,
                'cartId': cartId
            }
        });
    }

    const deleteItem = (id) => {
        if (!isSignedIn) {
            showToastMessage(Identify.__('You are not logged in. Please log in first.'));
            history.push('/login.html');
            return;
        }
        removeWishlistItem({
            variables: {
                'itemId': id
            }
        });
    }

    return {
        isLoading,
        addWishlist,
        addToCart,
        deleteItem,
        data
    }
};
