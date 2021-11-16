import { useMemo, useEffect, useCallback } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { simiUseMutation as useMutation } from 'src/simi/Network/Query';
import { useHistory } from 'react-router-dom';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading, hideFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import Identify from "src/simi/Helper/Identify";

import {
    ADD_WISHLIST,
    REMOVE_WISHLIST_ITEM
} from 'src/simi/App/core/Customer/Account/WishlistFragment/wishlistPage.gql';

export const useAddWishlist = props => {
    const { toggleMessages, showLoading } = props || {};
    const isShowLoading = showLoading || true;
    const [{ isSignedIn }] = useUserContext();
    const history = useHistory();


    const handleMessage = useCallback((message, type) => {
        if (toggleMessages)
            toggleMessages([{ type, message, auto_dismiss: true }])
        else
            showToastMessage(message)
    }, [toggleMessages])

    const onError = useCallback(errorTarget => {
        let derivedErrorMessage;
        if (errorTarget.graphQLErrors) {
            derivedErrorMessage = errorTarget.graphQLErrors
                .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                .join(', ');
        } else {
            derivedErrorMessage = errorTarget.message;
        }
        if (derivedErrorMessage)
            handleMessage(derivedErrorMessage, 'error')
    }, [handleMessage])

    const [addWishlistMutation, {
        data: dataAddWishlist,
        loading: loadingAddWishlist,
        error: errorAddWishlist
    }] = useMutation(ADD_WISHLIST, { onError });

    const [removeWishlistItemMutation, {
        data: dataRmWishlist,
        loading: loadingRmWishlist,
        error: errorRmWishlist
    }] = useMutation(REMOVE_WISHLIST_ITEM, { onError });

    const derivedErrorMessage = useMemo(() => {
        if (!errorAddWishlist && !errorRmWishlist) return null;
        const errorTarget = errorAddWishlist || errorRmWishlist
        if (errorTarget.graphQLErrors) {
            return errorTarget.graphQLErrors
                .map(({ message, debugMessage }) => debugMessage ? debugMessage : message)
                .join(', ');
        }
        return errorTarget.message;
    }, [errorAddWishlist]);

    const isLoading = loadingAddWishlist || loadingRmWishlist;
    if (isShowLoading) {
        if (isLoading) {
            showFogLoading();
        } else {
            hideFogLoading();
        }
    }

    useEffect(() => {
        if (dataAddWishlist && dataAddWishlist.wishlist) {
            handleMessage(Identify.__('This product has been added to wishlist'), 'success');
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [dataAddWishlist, handleMessage]);

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

    /**
     *
     * @param {int} wishlistitemId id
     */
    const removeWishlistItem = (id) => {
        if (!isSignedIn) {
            showToastMessage(Identify.__('You are not logged in. Please log in first.'));
            history.push('/login.html');
            return;
        }
        removeWishlistItemMutation({
            variables: {
                'itemId': id
            }
        });
    }

    return {
        isSignedIn,
        data: dataAddWishlist,
        loadingAddWishlist,
        errorAddWishlist,
        dataRmWishlist,
        loadingRmWishlist,
        errorRmWishlist,
        addWishlist,
        removeWishlistItem,
        derivedErrorMessage
    }
};
